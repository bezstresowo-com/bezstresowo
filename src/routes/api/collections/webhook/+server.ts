import { env } from '$env/dynamic/private';
import { text } from '@sveltejs/kit';
import { collectionStripe, deliverCollections } from '$shared/server/services/collection-delivery';
export async function POST({request,url}) {
 if(!env.COLLECTIONS_WEBHOOK_SECRET)return text('Not configured',{status:503});
 let event;try{event=collectionStripe().webhooks.constructEvent(await request.text(),request.headers.get('stripe-signature')??'',env.COLLECTIONS_WEBHOOK_SECRET);}catch{return text('Invalid signature',{status:400});}
 if(event.livemode)return text('Live events are not accepted',{status:400});
 if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded') {
  const session=event.data.object;
  if(session.metadata?.type!=='collection_series'||session.metadata.deliveryOrigin!==url.origin||session.payment_status!=='paid')return text('OK');
  try{await deliverCollections(session.id,url.origin);}catch{return text('Delivery not completed',{status:500});}
 }
 return text('OK');
}
