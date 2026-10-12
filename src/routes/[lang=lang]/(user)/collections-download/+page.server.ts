import { error, redirect } from '@sveltejs/kit';
import { collectionAccess, collectionLink, verifyCollectionToken } from '$shared/server/services/collection-delivery';
import { COLLECTION_NAMES } from '$shared/server/services/collection-order';
export async function load({url,setHeaders,params}) {
 setHeaders({'cache-control':'private, no-store','referrer-policy':'same-origin','x-robots-tag':'noindex, nofollow'});
 if(params.lang!=='uk')error(404,'Not found');
 const session=url.searchParams.get('session_id');
 if(session&&/^cs_test_[A-Za-z0-9]+$/.test(session)){try{await collectionAccess(session,url.origin);}catch{error(403,'Оплату ще не підтверджено.');}redirect(303,collectionLink(session,url.origin));}
 const token=url.searchParams.get('token')??'';const id=verifyCollectionToken(token);if(!id)error(403,'Недійсне посилання.');
 let access;try{access=await collectionAccess(id,url.origin);}catch{error(403,'Оплату не підтверджено.');}
 return {token,collections:access.order.ids.map(id=>({id,name:COLLECTION_NAMES[id]}))};
}
