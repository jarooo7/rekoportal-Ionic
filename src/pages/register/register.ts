import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ProfileModel, RegisterModel } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { getFormatedSearch } from '../../functions/format-search-text';
import { TranslateService } from '@ngx-translate/core';
import { ErrorCodes } from '../../enums/error-code';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

enum FormControlNames {
  EMAIL_ADDRESS = 'email',
  PASSWORD = 'password',
  NAME = 'name',
  LAST_NAME = 'lastName'
}

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage  implements OnInit {

  errorCode = ErrorCodes;
  registerForm: FormGroup;
  formControlNames = FormControlNames;

  constructor(public navCtrl: NavController,
    private auth: AuthProvider,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
  }

  
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      [FormControlNames.EMAIL_ADDRESS]: ['',
        [Validators.required, Validators.email]],
      [FormControlNames.PASSWORD]: ['', [Validators.required, Validators.minLength(6)]],
      [FormControlNames.NAME]: ['', [Validators.required, Validators.maxLength(100)]],
      [FormControlNames.LAST_NAME]: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }
  
  closeModal() {
    this.navCtrl.pop();
  }

  register() {
    this.auth.register(this.registerForm.value[FormControlNames.EMAIL_ADDRESS],
      this.registerForm.value[FormControlNames.PASSWORD]).then(u => {
      this.createProfile(u.uid, this.registerForm.value[FormControlNames.NAME], 
        this.registerForm.value[FormControlNames.LAST_NAME]
      );
      this.translate
      .get('alert.success.register')
      .subscribe(translation => {
        this.presentToast(translation, 'success');
      });
      this.closeModal();
    }
    ).catch( error => {
      switch (error.code) {
        case this.errorCode.UserNotFound: {
          this.translate
            .get('alert.error.userNotFound')
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
        case this.errorCode.EmailAlreadyInUse: {
          this.translate
            .get('alert.error.emailAlreadyInUse')
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
    });
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

  createProfile(uid: string, name: string, lastName: string) {
    console.log(uid, name, lastName);
    let user: ProfileModel
    let textSearch: string;
    textSearch = `${name} ${lastName}`;
    user = new ProfileModel; {
      user.name = name;
      user.lastName = lastName;
      user.search = getFormatedSearch(textSearch.toLowerCase());
      user.platform = 'email';
    }
    this.auth.createProfile(user, uid).then(
      () => {
        this.auth.sendActiveEmail();
      }
    );

  }

}
