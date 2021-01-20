import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GroupProvider } from '../../providers/group/group';
import { Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  logo: string ='./assets/imgs/logo.png';
  destroy$: Subject<boolean> = new Subject<boolean>();
  article = new BehaviorSubject([]);
  batch = 2;
  lastKey: string;
  finish: boolean;


  constructor(public navCtrl: NavController,
    private translate: TranslateService,
    private groupService: GroupProvider
  ) {

  }
  ngOnInit() {
    this.getPost();
  }

  onScroll (infiniteScroll) {
    this.getPost(infiniteScroll);
  }

  private getPost(infiniteScroll?) {
    if (this.finish) {
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      return; }
    let lastKey: string;
    const sub = this.groupService
    .getGlobalArticle(this.batch + 1 , this.lastKey)
    .pipe(
      map(article =>
        article.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(post => {
      if (this.finish) { return; }
      const articleR = post.reverse();
      articleR.forEach(p => {
          lastKey = p.timestamp;
      });
      if ((this.lastKey && this.lastKey === lastKey) || articleR.length === this.batch ) {
        this.finish = true;
      }
      this.lastKey = lastKey;
      const newArticle = _.slice(articleR, 0, this.batch);
      const currentArticle = this.article.getValue();
      this.article.next( _.concat(currentArticle, newArticle) );
      sub.unsubscribe();
    });
    setTimeout(() => {
      if(infiniteScroll){
        infiniteScroll.complete();
      }
    }, 500);
  }


  language(language: string) {
    this.translate.use(language);
    localStorage.setItem('language', language);
  }
}