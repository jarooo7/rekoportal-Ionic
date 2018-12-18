import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserModel } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';

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

  constructor( 
    private auth: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
    
  ) {
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

  presentToast(msg: string, color: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: color
    });
    toast.present();
  }

}
