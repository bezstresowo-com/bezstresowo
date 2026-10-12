import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import { collectionOrder, COLLECTION_NAMES } from '$shared/server/services/collection-order';
import { collectionStripe, collectionToken, readCollection, collectionConfigReady } from '$shared/server/services/collection-delivery';
import { prisma } from '$shared/server/services/prisma/prisma-service';
const limiter=createRateLimiter({max:10,windowMs:60000});
export async function POST({request,url,getClientAddress}) {
 if(request.headers.get('origin')!==url.origin)error(403,'Forbidden');
 if(!limiter.consume(getClientAddress()))error(429,'Спробуй за хвилину.');
 if(!request.headers.get('content-type')?.includes('application/json'))error(400,'Invalid request');
 const raw=await request.text();if(raw.length>2048)error(413,'Request too large');
 let order;try {const body=JSON.parse(raw);order=collectionOrder(body.plan,body.ids);}catch{error(400,'Перевір обрані збірки.');}
 if(!collectionConfigReady())error(503,'Тестова оплата ще готується.');
 let stripe;try{stripe=collectionStripe();collectionToken('cs_test_configuration');await prisma.bookDownload.count();for(const id of order.ids)await readCollection(id);}catch{error(503,'Тестова оплата ще готується.');}
 const session=await stripe.checkout.sessions.create({mode:'payment',adaptive_pricing:{enabled:false},payment_method_types:['card'],line_items:[{quantity:1,price_data:{currency:'pln',unit_amount:order.price,product_data:{name:order.plan==='one'?COLLECTION_NAMES[order.ids[0]]:order.plan==='three'?'Чужі бажання — три обрані збірки':'Чужі бажання — вся серія',description:order.ids.map(id=>COLLECTION_NAMES[id]).join('; ')}}}],success_url:url.origin+'/uk/collections-download?session_id={CHECKOUT_SESSION_ID}',cancel_url:url.origin+'/uk/materials/chuzhi-bazhannia',metadata:{type:'collection_series',version:'1',lang:'uk',plan:order.plan,collections:JSON.stringify(order.ids),deliveryOrigin:url.origin}});
 return json({url:session.url});
}
