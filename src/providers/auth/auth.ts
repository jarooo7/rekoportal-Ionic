import { Injectable } from '@angular/core';
import { UserModel, ProfileModel } from '../../models/user';
import { Status } from '../../models/status';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';

@Injectable()
export class AuthProvider {
  readonly authState$: Observable<User | null> = this.auth.authState;
  userName: string;
  userId: string;

 user: firebase.User;

  constructor(
    private auth: AngularFireAuth, 
    private gplus: GooglePlus,
    private platform: Platform,
    private dataBase: AngularFireDatabase) {
      auth.authState.subscribe(user => {
        this.user = user;});
      this.authState$.subscribe(user => {
        if (user) {
          this.userId = user.uid;
          this.userName = user.displayName;
          this.statOnline();
          this.updateOnDisconnect();
        } else {
          this.statOffline();
        }
      });
    }
    statOnline() {
      const stat: AngularFireObject<Status> = this.dataBase.object(`status/${this.userId}`);
      return stat.set({ status: 'online' });
    }
    statOffline() {
      if (this.userId) {
        const stat: AngularFireObject<Status> = this.dataBase.object(`status/${this.userId}`);
        return stat.set({ status: 'offline' }).then(() => this.userId = null);
      }
    }
    
    getProfile(userId) {
      let profile: AngularFireObject<ProfileModel> = null;
      profile = this.dataBase.object(`profile/${userId}`);
      return profile.snapshotChanges();
    }

    createProfile(profile: ProfileModel, uid: string) {
      let  regProfile: AngularFireObject<ProfileModel> = null;
      regProfile = this.dataBase
      .object(`profile/${uid}`);
      return regProfile.set(profile);
    }

    sendActiveEmail() {
      return this.auth.auth.currentUser.sendEmailVerification();
    }

    private updateOnDisconnect() {
      firebase.database().ref().child(`status/${this.userId}`)
              .onDisconnect()
              .update({status: 'offline'});
    }
  
  login(user: UserModel){
    return this.auth.auth.signInWithEmailAndPassword(user.email, user.password)
  }

  facebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.auth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    }).then((fireBaseUser) => {
    }
    );
  }

  async nativeGoogleLogin(): Promise<void> {
    try {
  
      const gplusUser = await this.gplus.login({
        'webClientId': '1018805222981-pupu688mkirovej0hcvif1iprhn1llpe.apps.googleusercontent.com'
      });
      return await this.auth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));
  
    } catch(err) {
      console.log(err);
    }
  }
  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.auth.auth.signInWithPopup(provider);
  
    } catch(err) {
      console.log(err)
    }
  
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  // googleLogin() {
  //   return new Promise<any>((resolve, reject) => {
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     provider.addScope('profile');
  //     provider.addScope('email');
  //     this.auth.auth
  //       .signInWithPopup(provider)
  //       .then(res => {
  //         resolve(res);
  //       });
  //   }).then((fireBaseUser) => {
      
  //   }
  //   );
  // }

  //  googleLogin() {
  //     this.auth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider()).then(res =>{});
    
  // }


  logout() {
    return this.auth.auth.signOut();
  }

  register(email: string, password: string){
    return this.auth.auth.createUserWithEmailAndPassword(email, password);
  }
}
