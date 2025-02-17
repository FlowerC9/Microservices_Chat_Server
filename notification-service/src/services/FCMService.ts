import admin from 'firebase-admin'

admin.initializeApp({
    credential:admin.credential.applicationDefault(),
})

export class FCMService{
    async sendPushNotification(token:string,message:string){
        const payload={
            notification:{
                title:"New Message",
                body:message
            },
            token:token,
        }
        try {
            await admin.messaging().send(payload);
            console.log("Notification send Successfully ");
        } catch (error) {
            console.log("Error sending notification ",error);
        }
    }
}