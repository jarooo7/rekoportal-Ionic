import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UserId } from '../../models/userId';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  constructor(private dataBase: AngularFireDatabase,) {

  }

  getFriends(id: string) {
    let result: AngularFireList<UserId> = null;
    result = this.dataBase.list(`friends/${id}`);
    return result;
  }

}
