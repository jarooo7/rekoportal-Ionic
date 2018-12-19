import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserModel } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user ={} as UserModel;
  isAuth: boolean;
  validate: boolean;
  logUser: Observable<firebase.User>;

  constructor( 
    private auth: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
      this.logUser = auth.authState$;
      this.logUser.subscribe(u => {
        if (u) {
          this.isAuth =  true;
          this.validate = u.emailVerified
        } else {
          this.validate = false;
          this.isAuth = false;
          console.log('sdad');
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: UserModel) {
    this.auth.login(user).then(() => this.presentToast('tak', 'success')).catch(() => this.presentToast('nie', 'danger'));
  }
  async register(user: UserModel) {
    this.auth.register(user).then(() => this.presentToast('tak', 'success')).catch(() => this.presentToast('nie', 'danger'));
  }

  logout(){
    this.auth.logout();
  }

  presentToast(msg: string, color: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: color
    });
    toast.present();
  }

  public loginFb() {
    this.auth.facebookLogin().then(() => this.presentToast('tak', 'success')).catch(() => this.presentToast('nie', 'danger'));
  }
  
  public loginGoogle() {
    this.auth.googleLogin().then(() => this.presentToast('tak', 'success')).catch(() => this.presentToast('nie', 'danger'));
  }
}
