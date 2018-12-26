import { Injectable } from '@angular/core';
import { UserModel, ProfileModel } from '../../models/user';
import { Status } from '../../models/status';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {
  readonly authState$: Observable<User | null> = this.auth.authState;
  userName: string;
  userId: string;

 user: firebase.User;

  constructor(
    private auth: AngularFireAuth, 
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
  googleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.auth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        });
    }).then((fireBaseUser) => {
      
    }
    );
  }


  logout() {
    return this.auth.auth.signOut();
  }

  register(user: UserModel){
    return this.auth.auth.createUserWithEmailAndPassword(user.email, user.password)
  }
}
