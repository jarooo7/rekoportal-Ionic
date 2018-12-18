import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthProvider {

  constructor(
    private auth: AngularFireAuth, 
  ) {
  }
  
  login(user: UserModel){
    return this.auth.auth.signInWithEmailAndPassword(user.email, user.password)
  }

  register(user: UserModel){
    return this.auth.auth.createUserWithEmailAndPassword(user.email, user.password)
  }
}
