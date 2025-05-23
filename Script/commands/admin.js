const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "مطور",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "ULLASH", //don't change my credit 
    description: "Show Owner Info",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    var callback = () => api.sendMessage({
        body: `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃      🌟 معلومات المطور المزز >< 🌟      
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 𝐍𝐚𝐦𝐞      : يونوو
┃
┃ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧  : متزوج معي ⁦ฅ⁠^⁠•⁠ﻌ⁠•⁠^⁠ฅ⁩
┃ 🎂 𝐀𝐠𝐞       : 21 ويي
┃ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧  : مسلم عمك
┃ 🏫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : مش شغلك
┃ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬  : الجزائر🫠
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🎭 𝐓𝐢𝐤𝐭𝐨𝐤  : مش شغلك
┃ 📢 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 : مش شغلك
┃ 🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : مش شغلك
┣━━━━━━━━━━━━━━━━━━━━━┫
┃
┗━━━━━━━━━━━━━━━━━━━━━┛
        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    return request(encodeURI(`https://graph.facebook.com/100000478146113/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
