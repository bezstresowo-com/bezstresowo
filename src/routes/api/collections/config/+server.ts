import { json } from '@sveltejs/kit';
import { collectionConfigReady } from '$shared/server/services/collection-delivery';
export function GET() {return json({ready:collectionConfigReady()},{headers:{'Cache-Control':'no-store'}});}
