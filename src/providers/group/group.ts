
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { ArticleModel } from '../../models/article';
import { GroupModel } from '../../models/group';
import { LikeModel } from '../../models/like';

/*
  Generated class for the GroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroupProvider {

  constructor(
    private dataBase: AngularFireDatabase,
  ) {

  }
  getGlobalArticle(batch: number, lastKey?: string) {
    let article: AngularFireList<ArticleModel> = null;
    if (lastKey) {
      article = this.dataBase.list('article', ref => ref.orderByChild('timestamp').limitToLast(batch).endAt(lastKey));
    } else {
      article = this.dataBase.list('article', ref => ref.orderByChild('timestamp').limitToLast(batch));
    }
    return article.snapshotChanges();
  }

  getGroup(id) {
    const gr: AngularFireObject<GroupModel> = this.dataBase.object(`group/${id}`);
    return gr.snapshotChanges();
  }

  addLike(groupId: string, userId: string, key: string,) {
    const like: AngularFireList<LikeModel> =  this.dataBase.list(`like/${groupId}/${key}`);
    let group: LikeModel;
    group = new LikeModel; {
      group.likeKey = userId;
    }
    return like.push(group);
  }

  getLike(groupId: string, key: string) {
    const like: AngularFireList<LikeModel> =  this.dataBase.list(`like/${groupId}/${key}`);
    return like.snapshotChanges();
  }

  delLike(groupId: string, postKey: string, key: string, ) {
    const like: AngularFireList<LikeModel> =  this.dataBase.list(`like/${groupId}/${postKey}/${key}`);
    return like.remove();
  }

}
