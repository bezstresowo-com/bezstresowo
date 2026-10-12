import assert from 'node:assert/strict';
import {collectionOrder,paidCollectionOrder} from '../src/shared/server/services/collection-order.ts';
let count=0;
for(let i=0;i<8;i++){assert.equal(collectionOrder('one',[i]).price,1900);count++;}
for(let a=0;a<8;a++)for(let b=a+1;b<8;b++)for(let c=b+1;c<8;c++){assert.equal(collectionOrder('three',[c,a,b]).price,4900);assert.deepEqual(collectionOrder('three',[c,a,b]).ids,[a,b,c]);count++;}
assert.equal(collectionOrder('all',[7,6,5,4,3,2,1,0]).price,9900);
for(const [plan,ids] of [['one',[]],['one',[0,1]],['three',[1,1,2]],['three',[0,1]],['three',[0,1,2,3]],['all',[0,1,2]],['bad',[0]],['one',['0']],['one',[-1]],['one',[8]],['one',[0.5]],['one',null]])assert.throws(()=>collectionOrder(plan,ids));
const paid={mode:'payment',payment_status:'paid',livemode:false,currency:'pln',amount_subtotal:4900,amount_total:4900,metadata:{type:'collection_series',version:'1',plan:'three',collections:'[0,4,7]'}};
assert.deepEqual(paidCollectionOrder(paid).ids,[0,4,7]);
for(const bad of [{payment_status:'unpaid'},{livemode:true},{amount_total:1900},{amount_subtotal:1900},{currency:'eur'},{mode:'subscription'},{metadata:{...paid.metadata,collections:'[0,0,7]'}},{metadata:{...paid.metadata,collections:'[0,4,7,6]'}},{metadata:{...paid.metadata,type:'book'}}])assert.equal(paidCollectionOrder({...paid,...bad}),null);
console.log(`${count} one/triple orders, full series, invalid orders and payment forgery checks passed.`);
