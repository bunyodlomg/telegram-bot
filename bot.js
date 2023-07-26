import {
    Bot
} from 'grammy'
import axios from 'axios'
import * as cheerio from 'cheerio'
import 'hijri-date';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import key from './regions.js'
import h_months from './h_months.js';
import months from './months.js';

const bot = new Bot('6585554144:AAEQFcniRN7pT5zyBzz2f0F6gmt7dS_-bjk')
const cyrillicToTranslit = new CyrillicToTranslit();

bot.command("start", async (ctx) => {
    ctx.reply("Hududni tanlang!", {
        reply_markup: {
            inline_keyboard: key,
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
});

const myFunc = (id) => {
    let res = 0;
    for (let i = 0; i < key.length; i++) {
        const reg = key[i].forEach(k => {
            if (k.callback_data == id) {
                return res = k.text
            }
        })
    }
    return res
}

bot.on("callback_query:data", async (ctx) => {
    const f_name = ctx.chat.first_name ? ctx.chat.first_name : ''
    const l_name = ctx.chat.last_name ? ctx.chat.last_name : '';
    const fullname = f_name + ' ' + l_name
    const reg_id = ctx.callbackQuery.data;
    const today = new HijriDate();
    const h_month = today._month;
    const h_year = today._year;
    const h_day = today._day;
    const date = new Date()
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDay();
    const res = await axios.get(`https://islom.uz/vaqtlar/${reg_id}/${month}`)
    const $ = cheerio.load(res.data);
    const hafta_kuni = $("tr.bugun > td:nth-child(3)").text()
    const tong = $("tr.bugun > td:nth-child(4)").text()
    const quyosh = $("tr.bugun > td:nth-child(5)").text()
    const peshin = $("tr.bugun > td:nth-child(6)").text()
    const asr = $("tr.bugun > td:nth-child(7)").text()
    const shom = $("tr.bugun > td:nth-child(8)").text()
    const hufton = $("tr.bugun > td:nth-child(9)").text()
    ctx.reply(
        `🗓 Milodiy ${day}-${months[month]} ${year}-yil.

🌙 Hijriy ${h_year}-yil ${h_months[h_month]} oyining ${h_day}-kuni

🤲🏼${fullname} ${cyrillicToTranslit.transform(hafta_kuni)} kuningiz barakatli bo'lsin!

${myFunc(reg_id)} namoz vaqti!

☝🏻Eslating! Zero, eslatma mo'minlarga manfaat yetkazur.(Zoriyot surasi 55-oyat).
                                
⏰${tong}   (BOMDOD)   Saharlik
    
⏰${quyosh}   (QUYOSH) 

⏰${peshin}   (TUSH)     

⏰${asr}   (ASR)      

⏰${shom}   (SHOM)    Iftorlik

⏰${hufton}   (XUFTON)

Ⓜ️anba: islom.uz`)
    await ctx.answerCallbackQuery();
});
bot.start()

