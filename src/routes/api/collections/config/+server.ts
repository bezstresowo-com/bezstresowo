import { json } from '@sveltejs/kit';
import { collectionLanguage } from '$shared/server/services/collection-order';
import { collectionConfigReady } from '$shared/server/services/collection-delivery';
export function GET({url}) {let ready=false;try{ready=collectionConfigReady(collectionLanguage(url.searchParams.get('lang')??undefined));}catch{/* Unknown languages cannot start checkout. */}return json({ready},{headers:{'Cache-Control':'no-store'}});}
