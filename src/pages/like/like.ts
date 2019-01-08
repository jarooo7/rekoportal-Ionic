import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { GroupProvider } from '../../providers/group/group';
import { map } from 'rxjs/operators';
import { LikeModel } from '../../models/like';

/**
 * Generated class for the LikePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-like',
  templateUrl: 'like.html',
})
export class LikePage {
  @Input() gid: string;
  @Input() set postId(id: string){
    this.key=id;
    this.isLiked = false;
    this.loadLike();
  }
  key: string;
  logUser: Observable<firebase.User>;
  quantity: number;
  isAuth = false;
  isLiked : boolean;
  isLikeKey: string;
  uid: string;
  like: LikeModel[] = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private auth: AuthProvider,
    private groupService: GroupProvider
  ) {
    this.logUser = auth.authState$;
    this.logUser.subscribe(u => {
      if (u) {
        this.uid = u.uid;
        this.isAuth =  true;
        if(this.like.length !== 0){
        this.like.forEach(result => {
          if (result.likeKey === this.uid) {
            this.isLiked = true;
            this.isLikeKey = result.likeKey;
          }
          }
        );}
      } else {
        this.isAuth = false;
      }
    });
  }

  addLike() {
    if (this.isLiked) {return; }
    this.groupService.addLike(this.gid,this.uid,this.key);
  }

  loadLike() {
    this.groupService.getLike(this.gid,this.key).pipe(
      map(like =>
        like.map( l => ({ key: l.payload.key, ...l.payload.val() }))
      ))
    .subscribe(u => {
      this.quantity = u.length;
      if(this.uid){
      u.forEach(result => {
        
        if (result.likeKey === this.uid) {
          this.isLiked = true;
          this.isLikeKey = result.key;
        }
        }
      );
    }
    });
  }
  delLike() {
    this.groupService.delLike(this.gid, this.key, this.isLikeKey);
    this.isLiked = false;
  }

}
