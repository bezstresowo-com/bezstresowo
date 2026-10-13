import { error, json } from '@sveltejs/kit';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import { collectionOrder, collectionLanguage, collectionNames } from '$shared/server/services/collection-order';
import { collectionConfig, collectionStripe, collectionToken, readCollection, collectionConfigReady } from '$shared/server/services/collection-delivery';
import { prisma } from '$shared/server/services/prisma/prisma-service';
const limiter=createRateLimiter({max:10,windowMs:60000});
export async function POST({request,url,getClientAddress}) {
 if(request.headers.get('origin')!==url.origin)error(403,'Forbidden');
 if(!limiter.consume(getClientAddress()))error(429,'Try again in a minute.');
 if(!request.headers.get('content-type')?.includes('application/json'))error(400,'Invalid request');
 const raw=await request.text();if(raw.length>2048)error(413,'Request too large');
 let order,lang;try {const body=JSON.parse(raw);lang=collectionLanguage(body.lang);order=collectionOrder(body.plan,body.ids);}catch{error(400,'Invalid collection selection or language.');}
 const unavailable=lang==='pl'?'Płatności są przygotowywane.':'Оплата ще готується.';
 if(!collectionConfigReady(lang))error(503,unavailable);
 let stripe;try{stripe=collectionStripe();collectionToken(collectionConfig().live?'cs_live_configuration':'cs_test_configuration');await prisma.bookDownload.count();for(const id of order.ids)await readCollection(id,lang);}catch{error(503,unavailable);}
 const names=collectionNames(lang);const series=lang==='pl'?'Cudze oczekiwania':'Чужі бажання';
 const session=await stripe.checkout.sessions.create({mode:'payment',allow_promotion_codes:!collectionConfig().live,locale:lang==='pl'?'pl':'auto',adaptive_pricing:{enabled:false},payment_method_types:['card'],line_items:[{quantity:1,price_data:{currency:'pln',unit_amount:order.price,product_data:{name:order.plan==='one'?names[order.ids[0]]:series+(order.plan==='three'?(lang==='pl'?' — trzy wybrane zeszyty':' — три обрані збірки'):(lang==='pl'?' — cała seria':' — вся серія')),description:order.ids.map(id=>names[id]).join('; ')}}}],success_url:url.origin+'/'+lang+'/collections-download?session_id={CHECKOUT_SESSION_ID}',cancel_url:url.origin+'/'+lang+'/materials/'+(lang==='pl'?'cudze-oczekiwania':'chuzhi-bazhannia'),metadata:{type:'collection_series',version:'1',lang,plan:order.plan,collections:JSON.stringify(order.ids),deliveryOrigin:url.origin}});
 return json({url:session.url});
}
