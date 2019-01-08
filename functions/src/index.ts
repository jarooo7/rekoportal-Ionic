import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

admin.initializeApp();


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