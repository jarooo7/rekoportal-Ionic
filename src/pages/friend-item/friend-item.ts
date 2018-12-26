import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserId } from '../../models/userId';
import { ChatProvider } from '../../providers/chat/chat';
import { map } from 'rxjs/operators';
import { ProfileModel } from '../../models/user';
import { MsgModel } from '../../models/msg';
import { MsgPage } from '../msg/msg';

/**
 * Generated class for the FriendItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend-item',
  templateUrl: 'friend-item.html',
})
export class FriendItemPage {
  @Input() set getFriend(uid: UserId) {
    this.friendId = uid;
    this.classRead = '';
    this.isReadOut(uid.msgId);
    this.loadMsg(uid.msgId);
    this.loadFriend();
    this.loadStat(uid.userId);
  }
  classRead: string;
  friendId: UserId;
  msg: MsgModel ;
  status: string;
  friend: ProfileModel;
  constructor(
    public modalCtrl: ModalController,
    private chatService: ChatProvider,
    public navCtrl: NavController, public navParams: NavParams
  ) { }

  loadStat(id: string) {
    this.chatService.getStat(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.status = result.status;
    });
  }

  loadFriend() {
    this.chatService.getProfile(this.friendId.userId).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.friend = result;
    });
  }

  openMsg(){
    let profileModal = this.modalCtrl.create(MsgPage, {
      id: this.friendId.userId,
      msgId: this.friendId.msgId,
      name: `${this.friend.name} ${this.friend.lastName}`, 
      avatar: this.friend.avatar.url
      });
    profileModal.present();
  }

  loadMsg(id){
    this.chatService.getMsg(id, 1 ).pipe(
      map(result =>
        result.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )).subscribe(result => {
      this.msg = result[0];
    });
  }
  
  isReadOut(id: string) {
    this.chatService.isReadOut(id).pipe(
      map(f => ({ key: f.payload.key, ...f.payload.val() }))
    ).subscribe(result => {
        if (result.isRead) {
          this.classRead = 'bold';
        } else {
          this.classRead = '';
        }
    });
  }

}
