import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth/auth';
import { ChatProvider } from '../../providers/chat/chat';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ContactPage;
  tab3Root = LoginPage;
  logUser: Observable<firebase.User>;
  msg = 0;
  notifMsg = false;
  isUser = false;

  constructor(
    private auth: AuthProvider,
    private chatService: ChatProvider,
  ) {
    this.logUser = auth.authState$;
    this.logUser.subscribe(u => {
      console.log(u);
      if (u) {
        this.isUser = true;
        this.notifiMsg(u.uid);
      } else {
        this.isUser = false;
      }
    });
  }
  notifiMsg(id: string) {
    this.chatService.notifiMsg(id).snapshotChanges().pipe(
      map(msg =>
        msg.map(f => ({ key: f.payload.key, ...f.payload.val() }))
      )
    ).subscribe(result => {
      this.msg = result.length;
      if(result.length !==0) {
        this.notifMsg = true;
      } else {
        this.notifMsg = false;
      }
    });
  }
}
