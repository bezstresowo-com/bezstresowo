import { EMAIL_APP_PASSWORD, EMAIL_SENDER, EMAIL_SUBJECT_PREFIX } from '$env/static/private';
import { createTransport } from 'nodemailer';
import type { CollectionLanguage } from './collection-order';
import { collectionEmail } from './collection-email-template';
const transport = createTransport({service:'gmail',auth:{user:EMAIL_SENDER,pass:EMAIL_APP_PASSWORD}});
export async function collectionDeliveryMessage(email:string,downloadUrl:string,names:readonly string[],lang:CollectionLanguage='uk') {
 const message=collectionEmail(downloadUrl,names,lang);
 await transport.sendMail({from:EMAIL_SENDER,to:email,...message,subject:`${EMAIL_SUBJECT_PREFIX} ${message.subject}`});
}
