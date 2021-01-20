import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { UserModel, ProfileModel } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { FcmProvider } from '../../providers/fcm/fcm';
import { RegisterPage } from '../register/register';
import { TranslateService } from '@ngx-translate/core';
import { ErrorCodes } from '../../enums/error-code';

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

  user = {} as UserModel;
  isAuth: boolean;
  errorCode = ErrorCodes;
  profile: ProfileModel;
  validate: boolean;
  logUser: Observable<firebase.User>;

  constructor(
    private fcm: FcmProvider,
    private auth: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private translate: TranslateService,
    public toastCtrl: ToastController

  ) {
    this.logUser = auth.authState$;
    this.logUser.subscribe(u => {
      if (u) {
        this.isAuth = true;
        this.validate = u.emailVerified;
        this.loadProfile(u.uid);
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
    this.auth.login(user).then(u => {
      this.translate
        .get('alert.success.welcom')
        .subscribe(translation => {
          this.presentToast(translation, 'success');
        });
      this.fcm.getToken(u.uid);
    })
      .catch(
        error => {
          switch (error.code) {
            case this.errorCode.UserNotFound: {
              this.translate
                .get('alert.error.userNotFound')
                .subscribe(translation => {
                  this.presentToast(translation, 'danger');
                });
              break;
            }
            case this.errorCode.WrongPassword: {
              this.translate
                .get('alert.error.wrongPassword')
                .subscribe(translation => {
                  this.presentToast(translation, 'danger');
                });
              break;
            }
            case this.errorCode.InvalidEmail: {
              this.translate
                .get('alert.error.invalidEmail')
                .subscribe(translation => {
                  this.presentToast(translation, 'danger');
                });
              break;
            }
            default: {
              this.translate
                .get('alert.error.notConect')
                .subscribe(translation => {
                  this.presentToast(translation, 'danger');
                });
              break;
            }
          }
        }
      );


  }

  register() {
    let profileModal = this.modalCtrl.create(RegisterPage);
    profileModal.present();
  }

  logout() {
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
    this.auth.googleLogin();
  }


  loadProfile(id: string) {
    this.auth.getProfile(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.profile = result;
    });
  }

}
