import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupItemPage } from './group-item';

@NgModule({
  declarations: [
    GroupItemPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupItemPage),
  ],
})
export class GroupItemPageModule {}
