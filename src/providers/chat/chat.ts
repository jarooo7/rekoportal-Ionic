import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { UserId } from '../../models/userId';
import { ProfileModel } from '../../models/user';
import { MsgNotificationModel } from '../../models/msg';
import { AuthProvider } from '../auth/auth';
import { Status } from '../../models/status';

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

  isReadOut(key: string) {
    let ref: AngularFireObject<MsgNotificationModel> =  null;
    ref = this.dataBase.object(`msgNotificationModel/${this.userId}/${key}`);
    return ref.snapshotChanges();
  }


}
