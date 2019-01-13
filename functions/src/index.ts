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


exports.newSubscriberNotification = functions.database.ref('/msgNotificationModel/{userId}/{msgId}')
    .onCreate(async (snapshot, context) => {
        
   
    const date = snapshot.val();
    const userId = date.userId;

    // Notification content
    const payload = {
      notification: {
          title: 'Nowa wiadomość ',
          body: `Masz nową wiadomość od ${date.name}`,
          icon: 'notification_icon'
      }
    }

    const db = admin.firestore()
    const devicesRef = db.collection('devices').where('userId', '==', userId)


    // get the user's tokens and send notifications
    const devices = await devicesRef.get();

    const tokens = [];

    // send a notification to each device token
    devices.forEach(result => {
      const token = result.data().token;

      tokens.push( token )
    })

    return admin.messaging().sendToDevice(tokens, payload)

    // send a notification to each device token
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