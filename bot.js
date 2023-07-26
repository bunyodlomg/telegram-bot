import {
    Bot
} from 'grammy'
import axios from 'axios'
import * as cheerio from 'cheerio'
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import key from './regions.js'

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
    const reg_id = ctx.callbackQuery.data;
    const m = new Date().getMonth()+1
    const res = await axios.get(`https://islom.uz/vaqtlar/${reg_id}/${m}`)
    const $ = cheerio.load(res.data);
    const f_name = ctx.chat.first_name ? ctx.chat.first_name : ''
    const l_name = ctx.chat.last_name ? ctx.chat.last_name : '';
    const fullname = f_name + ' ' + l_name
    const hijriy = cyrillicToTranslit.transform($("div.date_time").text().split('|')[0]);
    const milodiy = cyrillicToTranslit.transform($("div.date_time").text().split('|')[1]);
    const hafta_kuni = $("tr.bugun > td:nth-child(3)").text()
    const tong = $("tr.bugun > td:nth-child(4)").text()
    const quyosh = $("tr.bugun > td:nth-child(5)").text()
    const peshin = $("tr.bugun > td:nth-child(6)").text()
    const asr = $("tr.bugun > td:nth-child(7)").text()
    const shom = $("tr.bugun > td:nth-child(8)").text()
    const hufton = $("tr.bugun > td:nth-child(9)").text()
    ctx.reply(
        `🗓 ${milodiy}

🌙 ${hijriy}

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