import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupProvider } from '../../providers/group/group';
import { map } from 'rxjs/operators';
import { GroupModel } from '../../models/group';


@IonicPage()
@Component({
  selector: 'page-group-item',
  templateUrl: 'group-item.html',
})
export class GroupItemPage {
  
  @Input() set groupId(gid: string){
    this.gid = gid;
    this.loadGroup(gid);
  }
  @Input() date: string;
  gid: string;
  group: GroupModel;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private groupService: GroupProvider
  ) {
  }
  loadGroup(id: string) {
    this.groupService.getGroup(id).pipe(
      map(group => ({ key: group.payload.key, ...group.payload.val() })
      )
    ).subscribe(res => {
      this.group = res;
    });
  }

}
