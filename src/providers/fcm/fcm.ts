import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class FcmProvider {

  constructor(
    private dataBase: AngularFireDatabase,
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform
  ) {}


  async getToken(uid: string) {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    } 
  
    // if (this.platform.is('ios')) {
    //   token = await this.firebaseNative.getToken();
    //   await this.firebaseNative.grantPermission();
    // } 
    
    return this.saveTokenToFirestore(token, uid);
   }

  private saveTokenToFirestore(token: string, uid: string) {
    if (!token) return;

  const devicesRef = this.afs.collection('devices');

  const docData = { 
    token,
    userId: uid,
  };
  

  return devicesRef.doc(token).set(docData);
  }

  
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }

}