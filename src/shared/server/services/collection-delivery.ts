import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';
import Stripe from 'stripe';
import { readPrivateBook, type Book } from './book-delivery';
import { COLLECTION_NAMES, paidCollectionOrder } from './collection-order';
import { prisma } from './prisma/prisma-service';
import { collectionDeliveryMessage } from './collection-email';
import { collectionPaymentConfig, isCollectionSessionId } from './collection-mode';
export function collectionConfig() { return collectionPaymentConfig(env); }
export function validCollectionSessionId(id: unknown) { try { return isCollectionSessionId(id, collectionConfig().live); } catch { return false; } }
export function collectionStripe() {
 return new Stripe(collectionConfig().key);
}
function secret() {if (!env.BOOK_DOWNLOAD_SECRET || env.BOOK_DOWNLOAD_SECRET.length<32) throw new Error('Missing signing secret');return env.BOOK_DOWNLOAD_SECRET;}
export function collectionConfigReady() {try {collectionConfig(); return Boolean(env.BOOK_DOWNLOAD_SECRET && env.BOOK_DOWNLOAD_SECRET.length >= 32 && env.AWS_BOOKS_BUCKET_NAME && env.EMAIL_SENDER && env.EMAIL_APP_PASSWORD && Array.from({length:8}, (_,i)=>env[`COLLECTION_${String(i+1).padStart(2,'0')}_OBJECT_KEY`]).every(Boolean));} catch {return false;}}
export async function readCollection(id:number) {
 if (!Number.isInteger(id)||id<0||id>7) throw new Error('Unknown collection');
 // Reuse the established S3 privacy and PDF validation without modifying other books.
 const objectKeyEnv=`COLLECTION_${String(id+1).padStart(2,'0')}_OBJECT_KEY`;
 return readPrivateBook({objectKeyEnv} as Book);
}
export function collectionToken(sessionId:string) {
 if (!validCollectionSessionId(sessionId)) throw new Error('Invalid collection session');
 const data=Buffer.from(JSON.stringify({type:'collection_series',sessionId})).toString('base64url');
 return data+'.'+createHmac('sha256',secret()).update(data).digest('base64url');
}
export function verifyCollectionToken(token:string) {
 try {if(token.length>1024)return null;const [data,sig,...extra]=token.split('.');if(!data||!sig||extra.length)return null;const expected=createHmac('sha256',secret()).update(data).digest();const actual=Buffer.from(sig,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;const payload=JSON.parse(Buffer.from(data,'base64url').toString());return payload.type==='collection_series'&&validCollectionSessionId(payload.sessionId)?payload.sessionId:null;}catch{return null;}
}
export function collectionLink(sessionId:string,origin:string){return new URL('/uk/collections-download?token='+collectionToken(sessionId),origin).toString();}
export async function collectionAccess(sessionId:string,origin:string) {
 const session=await collectionStripe().checkout.sessions.retrieve(sessionId);
 const order=paidCollectionOrder(session, collectionConfig().live);
 if(!order||session.metadata?.deliveryOrigin!==origin)throw new Error('Payment is not confirmed');
 for(const id of order.ids)await prisma.bookDownload.upsert({where:{id:`collections:${session.id}:${id}`},create:{id:`collections:${session.id}:${id}`},update:{}});
 return {session,order};
}
export async function deliverCollections(sessionId:string,origin:string) {
 const {session,order}=await collectionAccess(sessionId,origin);const done=`collections-email:${session.id}`;const lock=done+':processing';
 if(await prisma.processedStripeEvent.findUnique({where:{eventId:done}}))return;
 await prisma.processedStripeEvent.deleteMany({where:{eventId:lock,createdAt:{lt:new Date(Date.now()-5*60*1000)}}});
 try {await prisma.processedStripeEvent.create({data:{eventId:lock}});}catch(cause){if((cause as {code?:string}).code==='P2002')throw new Error('Delivery already processing');throw cause;}
 try {
  if(!session.customer_details?.email)throw new Error('Missing delivery email');
  await collectionDeliveryMessage(session.customer_details.email,collectionLink(session.id,origin),order.ids.map(id=>COLLECTION_NAMES[id]));
  await prisma.processedStripeEvent.create({data:{eventId:done}});
 } finally {await prisma.processedStripeEvent.deleteMany({where:{eventId:lock}});}
}
