import { EMAIL_APP_PASSWORD, EMAIL_SENDER, EMAIL_SUBJECT_PREFIX } from '$env/static/private';
import { createTransport } from 'nodemailer';
const transport = createTransport({service:'gmail',auth:{user:EMAIL_SENDER,pass:EMAIL_APP_PASSWORD}});

 export async function collectionDeliveryMessage(email: string, downloadUrl: string, names: readonly string[]) {
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  await transport.sendMail({from: EMAIL_SENDER,to: email,subject: `${EMAIL_SUBJECT_PREFIX} Твої збірки «Чужі бажання»`,text: `Дякую за покупку!\n\nТвої збірки:\n${names.join('\n')}\n\nЗавантажити: ${downloadUrl}\n\nКожну збірку можна завантажити до трьох разів. Збережи файли на своєму пристрої. Допомога: bezstresowo.org@gmail.com.\n\nОлеся Гайдук · Психолог і психотерапевт`,html: `<div lang="uk" style="background:#F3F0E7;color:#22344E;padding:32px;font:16px/1.6 Arial"><p>BEZSTRESOWO</p><h1>Твої збірки вже тут</h1><p>Дякую за покупку!</p><ul>${names.map(name=>`<li>${escape(name)}</li>`).join('')}</ul><p><a href="${escape(downloadUrl)}" style="display:inline-block;background:#22344E;color:white;padding:14px 24px;text-decoration:none">Завантажити збірки</a></p><p>Кожну збірку можна завантажити до трьох разів. Відкриття листа чи сторінки не витрачає спробу. Збережи файли на своєму пристрої.</p><p>Допомога: bezstresowo.org@gmail.com</p><p>Олеся Гайдук<br>Психолог і психотерапевт</p><p style="font-size:12px">Цей лист стосується твого замовлення й не підписує тебе на рекламу.</p></div>`});
 }
