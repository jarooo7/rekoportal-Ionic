import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendItemPage } from './friend-item';

@NgModule({
  declarations: [
    FriendItemPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendItemPage),
  ],
})
export class FriendItemPageModule {
  
}
