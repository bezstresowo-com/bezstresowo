export const limits={one:1,three:3,all:8};
export const prices={one:19,three:49,all:99};
export function switchMode(mode){if(!(mode in limits))throw Error('Unknown plan');return {mode,selected:mode==='all'?Array.from({length:8},(_,i)=>i):[]};}
export function toggle(state,id){if(!Number.isInteger(id)||id<0||id>7)throw Error('Unknown product');if(state.mode==='all')return state;let selected=state.selected.includes(id)?state.selected.filter(x=>x!==id):state.mode==='one'?[id]:state.selected.length<3?[...state.selected,id]:state.selected;return {...state,selected};}
export function ready(state){return new Set(state.selected).size===limits[state.mode];}
