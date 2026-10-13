import type { CollectionLanguage } from './collection-order';
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function collectionEmail(downloadUrl: string,names: readonly string[],lang: CollectionLanguage='uk') {
 const url=new URL(downloadUrl);if(url.protocol!=='https:')throw new Error('Invalid delivery URL');
 const pl=lang==='pl';
 const subject=pl?'Twoje zbiory „Cudze oczekiwania”':'Твої збірки «Чужі бажання»';
 const title=pl?'Twoje zbiory już tutaj':'Твої збірки вже тут';
 const thanks=pl?'Dziękuję za zakup!':'Дякую за покупку!';
 const list=pl?'Twoje zbiory:':'Твої збірки:';
 const button=pl?'Pobierz zbiory':'Завантажити збірки';
 const download=pl?'Pobierz:':'Завантажити:';
 const instructions=pl?'Każdy zbiór możesz pobrać do trzech razy. Otwarcie e-maila lub strony nie zużywa próby. Zapisz pliki na swoim urządzeniu.':'Кожну збірку можна завантажити до трьох разів. Відкриття листа чи сторінки не витрачає спробу. Збережи файли на своєму пристрої.';
 const help=pl?'Pomoc:':'Допомога:';
 const author=pl?'Olesya Haiduk':'Олеся Гайдук';
 const profession=pl?'Psychoterapeuta':'Психолог і психотерапевт';
 const note=pl?'Ten e-mail dotyczy Twojego zamówienia i nie zapisuje Cię do reklam.':'Цей лист стосується твого замовлення й не підписує тебе на рекламу.';
 return {subject,text:`${thanks}\n\n${list}\n${names.join('\n')}\n\n${download} ${downloadUrl}\n\n${instructions}\n${help} bezstresowo.org@gmail.com\n\n${author} · ${profession}`,html:`<div lang="${lang}" style="background:#F3F0E7;color:#22344E;padding:32px;font:16px/1.6 Arial"><p>BEZSTRESOWO</p><h1>${title}</h1><p>${thanks}</p><ul>${names.map(name=>`<li>${escape(name)}</li>`).join('')}</ul><p><a href="${escape(downloadUrl)}" style="display:inline-block;background:#22344E;color:white;padding:14px 24px;text-decoration:none">${button}</a></p><p>${instructions}</p><p>${help} bezstresowo.org@gmail.com</p><p>${author}<br>${profession}</p><p style="font-size:12px">${note}</p></div>`};
}
