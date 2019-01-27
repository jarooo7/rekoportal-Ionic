import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

admin.initializeApp();

exports.newArticle = functions.database.ref('/article/{key}')
    .onCreate(async (snapshot, context) => {
      const idA = snapshot.key;
      const date = snapshot.val();
      const groupId = date.groupId;
      const not = {
        read: false,
        idArticle:  snapshot.key,
        timestamp: date.timestamp,
        groupId: date.groupId
      };
      const users = [];
      const db = admin.firestore();
      const ref = db.collection('sub').doc('group').collection(groupId);
      const sub = await ref.get();
      sub.forEach(result => {
        const u = result.data().userId;
        const sRef = db.collection('sub').doc('user').collection(u);
        const op = sRef.doc(idA).set(not);
      });
    });


exports.notificationMsg = functions.database.ref('/msgNotificationModel/{userId}/{msgId}')
    .onCreate(async (snapshot, context) => {
    const date = snapshot.val();
    const userId = date.userId;
    const notif = {
      notification: {
          title: 'Nowa wiadomość ',
          body: `Masz nową wiadomość od ${date.name}`,
          icon: 'notification_icon'
      }
    }
    const database = admin.firestore()
    const ref = database.collection('devices').where('userId', '==', userId)
    const devices = await ref.get();
    const tokens = [];
    devices.forEach(result => {
      const token = result.data().token;
      tokens.push( token )
    })
    return admin.messaging().sendToDevice(tokens, notif)
});

exports.emailVerifiedFb = functions.database.ref('/profile/{uid}')
    .onCreate(async (snapshot, context) => {
      const date = snapshot.val();
      const uid = snapshot.key;
      const platform = date.platform;
      if(platform === 'fb') {
         const operation = admin.auth().updateUser(uid , {
            emailVerified: true
          })
      }
    });