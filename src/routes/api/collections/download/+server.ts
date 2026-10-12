import { error } from '@sveltejs/kit';
import { collectionAccess, readCollection, verifyCollectionToken } from '$shared/server/services/collection-delivery';
import { collectionNames } from '$shared/server/services/collection-order';
import { consumeBookDownload } from '$shared/server/services/book-download-counter';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
const limiter=createRateLimiter({max:20,windowMs:60000});
export async function POST({request,url,getClientAddress}) {
 if(request.headers.get('origin')!==url.origin)error(403,'Forbidden');
 if(!limiter.consume(getClientAddress()))error(429,'Спробуй за хвилину.');
 if(Number(request.headers.get('content-length')??0)>4096)error(413,'Request too large');
 const form=await request.formData();const sessionId=verifyCollectionToken(String(form.get('token')??''));const id=Number(form.get('id'));
 if(!sessionId||!Number.isInteger(id))error(403,'Недійсне посилання.');
 let access;try{access=await collectionAccess(sessionId,url.origin);}catch{error(403,'Оплату не підтверджено.');}
 if(!access.order.ids.includes(id))error(403,access.lang==='pl'?'Ten zeszyt nie został zakupiony.':'Цю збірку не придбано.');
 const pdf=await readCollection(id,access.lang);
 if(!await consumeBookDownload(prisma.bookDownload,`collections:${sessionId}:${id}`))error(403,access.lang==='pl'?'Wykorzystano trzy pobrania. Napisz na bezstresowo.org@gmail.com.':'Три завантаження використано. Напиши на bezstresowo.org@gmail.com.');
 return new Response(new Uint8Array(pdf),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="Collection-${id+1}.pdf"; filename*=UTF-8''${encodeURIComponent(collectionNames(access.lang)[id]+'.pdf')}`,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'}});
}
