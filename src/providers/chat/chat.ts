import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { UserId } from '../../models/userId';
import { ProfileModel } from '../../models/user';
import { MsgNotificationModel, MsgModel } from '../../models/msg';
import { AuthProvider } from '../auth/auth';
import { Status } from '../../models/status';
import * as firebase from 'firebase/app';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  userId: string;

  constructor(private dataBase: AngularFireDatabase,
    private authService: AuthProvider
  ) {
    this.authService.authState$.subscribe(user => {
      if (user) {
        if (user.uid) {
          this.userId = user.uid;
        }
      }
    });
  }

  getStat(userId) {
    const stat: AngularFireObject<Status> = this.dataBase.object(`status/${userId}`);
    return stat.snapshotChanges();
  }

  getFriends(id: string) {
    let result: AngularFireList<UserId> = null;
    result = this.dataBase.list(`friends/${id}`);
    return result;
  }

  getProfile(userId) {
    let profile: AngularFireObject<ProfileModel> = null;
    profile = this.dataBase.object(`profile/${userId}`);
    return profile.snapshotChanges();
  }
  
  getMsg(id: string, batch: number, lastKey?: string) {
    let com: AngularFireList<MsgModel> =  null;
    if (lastKey) {
      com = this.dataBase.list(`msg/${id}`, ref => ref.orderByChild('timestamp').limitToLast(batch).endAt(lastKey));
    } else {
      com = this.dataBase.list(`msg/${id}`, ref => ref.orderByChild('timestamp').limitToLast(batch));
    }
    return com.snapshotChanges();
  }

  getNewMsg(id: string, startKey: string) {
    let com: AngularFireList<MsgModel> =  null;
    com = this.dataBase.list(`msg/${id}`, ref => ref.orderByChild('timestamp').startAt(startKey));
    return com.snapshotChanges();
  }

  time() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  sentMsg(key: string, text: string) {
    const message: AngularFireList<MsgModel> = this.dataBase.list(`msg/${key}`);
    let msg: MsgModel;
    msg = new MsgModel; {
      msg.timestamp = this.time();
      msg.text = text;
      msg.userId = this.userId;
    }
    return message.push(msg);
  }
  readOut(key: string) {
    let ref: AngularFireObject<MsgNotificationModel> =  null;
    ref = this.dataBase.object(`msgNotificationModel/${this.userId}/${key}`);
    return ref.remove();
  }
  
  notifiMsg(id: string) {
    return this.dataBase.list(`msgNotificationModel/${id}`);
  }

  newMsg(userId: string, key: string) {
    let ref: AngularFireObject<MsgNotificationModel> =  null;
    ref = this.dataBase.object(`msgNotificationModel/${userId}/${key}`);
    return ref.set({isRead: true});
  }

  isReadOut(key: string) {
    let ref: AngularFireObject<MsgNotificationModel> =  null;
    ref = this.dataBase.object(`msgNotificationModel/${this.userId}/${key}`);
    return ref.snapshotChanges();
  }
}
