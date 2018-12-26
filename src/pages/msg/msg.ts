import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { map } from 'rxjs/operators';
import { ChatProvider } from '../../providers/chat/chat';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { MsgModel } from '../../models/msg';
import { Content } from 'ionic-angular';

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
  @ViewChild(Content) content: Content;
  sub;
  msgId: string;
  name: string;
  avatar: string;
  status: string;
  textMsg: string;

  finish: boolean;
  startId: string;
  batch = 20;
  classBar: string;
  lastKey: string;
  msgs = new BehaviorSubject<MsgModel[]>([]);
  newMsgList: MsgModel[] = [];
  isOpen = true;
  uid: string;
 


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private chatService: ChatProvider
  ) {
    this.uid = navParams.get('id');
    this.loadStat(navParams.get('id'));
    this.msgId = navParams.get('msgId');
    this.name = navParams.get('name');
    this.avatar = navParams.get('avatar');
    this.startGetMsg(navParams.get('msgId'));
  }

  ionViewDidLoad() {
  }

  loadStat(id: string) {
    this.chatService.getStat(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.status = result.status;
    });
  }

  

  scrollToBottom() {
    try {
      setTimeout(()=>{  
        this.content.scrollToBottom();
   }, 500);
    } catch (err) { }
  }

  private readOut() {
    this.chatService.readOut(this.msgId);
  }

  private getMsg(id) {
    if (this.finish) { return; }
    let lastKey: string;
    const sub = this.chatService
    .getMsg(id, this.batch + 1 , this.lastKey)
    .pipe(
      map(result =>
        result.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(msg => {
      if (this.finish) { return; }
      const msgR = msg.reverse();
      if (!this.lastKey && msgR[0]) {
        this.startId = msgR[0].timestamp;
      }
      msgR.forEach(c => {
          lastKey = c.timestamp;
      });
      if ((this.lastKey && this.lastKey === lastKey) || msgR.length <= this.batch ) {
        this.finish = true;
      }
      this.lastKey = lastKey;
      const newCom = _.slice(msgR, 0, this.batch);
      const currentCom = this.msgs.getValue();
      this.msgs.next( _.concat(newCom.reverse(), currentCom) );
      sub.unsubscribe();
    }
    );
  }

  private startGetMsg(id) {
    if (this.finish) { return; }
    let lastKey: string;
    const sub = this.chatService
    .getMsg(id, this.batch + 1 , this.lastKey)
    .pipe(
      map(result =>
        result.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(msg => {
      if (this.finish) { return; }
      const msgR = msg.reverse();
      if (!this.lastKey && msgR[0]) {
        this.startId = msgR[0].timestamp;
      }
      this.loadNewMsg(id);
      msgR.forEach(c => {
          lastKey = c.timestamp;
      });
      if ((this.lastKey && this.lastKey === lastKey) || msgR.length <= this.batch ) {
        this.finish = true;
      }
      this.lastKey = lastKey;
      const newCom = _.slice(msgR, 0, this.batch);
      const currentCom = this.msgs.getValue();
      this.msgs.next( _.concat(newCom.reverse(), currentCom) );
      sub.unsubscribe();
    }
    );
  }

  loadNewMsg(id) {
    this.sub = this.chatService
    .getNewMsg(id, this.startId  )
    .pipe(
      map(result =>
        result.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(com => {
      let n = this.newMsgList.length;
      if (!this.startId && com[0]) {
      this.startId = com[0].timestamp;
      }
      if (this.msgs.getValue().length === 0 || (this.msgs.getValue().length === 0 && this.newMsgList.length !== 0)) {
        const com3 = _.slice(com, this.newMsgList.length);
        com3.forEach(c => {
          this.newMsgList[n] = c;
          n++;
        });
      } else {
      const com2 = _.slice(com, this.newMsgList.length + 1);
      com2.forEach(c => {
        this.newMsgList[n] = c;
        n++;
      });
      }
      this.scrollToBottom();
      this.readOut();
    });
  }

  next() {
    this.getMsg(this.msgId);
  }

  closeModal() {
    this.sub.unsubscribe();
    this.navCtrl.pop();
  }

  isMyMsg(id: string) {
    if (id === this.uid) {
      return false;
    } else {
      return true;
    }
  }

  
  async sendMsg(text: string) {
    this.chatService.sentMsg(this.msgId, text).then(
      () => {
        this. resetForm();
        this.chatService.newMsg(this.uid, this.msgId);
      });
  }
  resetForm() {
    this.textMsg = '';
  }
}
