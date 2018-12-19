import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { TranslateModule } from '@ngx-translate/core';
import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(LoginPage),
    AngularFireDatabaseModule
  ],
})
export class LoginPageModule {}
