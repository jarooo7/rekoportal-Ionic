import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserId } from '../../models/userId';
import { ChatProvider } from '../../providers/chat/chat';
import { map } from 'rxjs/operators';
import { ProfileModel } from '../../models/user';

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
    this.isRead = false;
    this.isReadOut(uid.msgId);
    this.loadFriend();
    this.loadStat(uid.userId);
  }
  isRead: boolean;
  friendId: UserId;
  status: string;
  friend: ProfileModel;
  constructor(
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

  
  isReadOut(id: string) {
    this.chatService.isReadOut(id).pipe(
      map(f => ({ key: f.payload.key, ...f.payload.val() }))
    ).subscribe(result => {
        if (result.isRead) {
          this.isRead = true;
        } else {
          this.isRead = false;
        }
    });
  }

}
