import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { map } from 'rxjs/operators';
import { UserId } from '../../models/userId';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  friends: Observable<UserId[]>
  // friends: UserId[] = [];
  isAuth: boolean;
  validate: boolean;
  logUser: Observable<firebase.User>;

  constructor(
    private auth: AuthProvider,
    private chatService: ChatProvider,
    public navCtrl: NavController) {
      this.logUser = auth.authState$;
      this.logUser.subscribe(u => {
        if (u) {
          this.isAuth =  true;
          this.validate = u.emailVerified
          console.log(u.uid);
          this.getFriends(u.uid);
        } else {
          this.validate = false;
          this.isAuth = false;
          console.log('sdad');
        }
      });

  }

  getFriends(id: string) {
    this.friends = this.chatService.getFriends(id).snapshotChanges()
    .pipe(map(
        changes => 
        changes.map(c => ({
        key: c.payload.key, ...c.payload.val()
      }))
    )
  );}

}
