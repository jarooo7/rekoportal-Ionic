import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { map } from 'rxjs/operators';
import { ChatProvider } from '../../providers/chat/chat';

/**
 * Generated class for the MsgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-msg',
  templateUrl: 'msg.html',
})
export class MsgPage {

  msgId: string;
  name: string;
  avatar: string;
  status: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private chatService: ChatProvider
  ) {
    this.loadStat(navParams.get('id'));
    this.msgId = navParams.get('msgId');
    this.name = navParams.get('name');
    this.avatar = navParams.get('avatar');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MsgPage');
  }

  loadStat(id: string) {
    this.chatService.getStat(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.status = result.status;
    });
  }

  closeModal() {
    this.navCtrl.pop();
  }
}
