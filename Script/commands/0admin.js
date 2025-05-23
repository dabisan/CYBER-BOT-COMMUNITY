var request = require("request");const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");
module.exports.config = {
	name: "0admin",
	version: "1.0.5",
	hasPermssion: 0,
	credits: "YUNA BOT >-<",
	description: "Admin Config",
	commandCategory: "Admin",
	usages: "Admin",
    cooldowns: 2,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "vi": {
        "listAdmin": `===「 𝗗𝗔𝗡𝗛 𝗦𝗔́𝗖𝗛 𝗔𝗗𝗠𝗜𝗡 」===\n━━━━━━━━━━━━━━━\n%1\n\n==「 𝗡𝗚𝗨̛𝗢̛̀𝗜 𝗛𝗢̂̃ 𝗧𝗥𝗢̛̣ 𝗕𝗢𝗧 」==\n━━━━━━━━━━━━━━━\n%2`,
        "notHavePermssion": '𝗠𝗢𝗗𝗘 - Bạn không đủ quyền hạn để có thể sử dụng chức năng "%1"',
        "addedNewAdmin": '𝗠𝗢𝗗𝗘 - Đã thêm thành công %1 người dùng trở thành Admin Bot\n\n%2',
      "addedNewNDH": '𝗠𝗢𝗗𝗘 - Đã thêm thành công %1 người dùng trở thành Người hỗ trợ\n\n%2',
        "removedAdmin": '𝗠𝗢𝗗𝗘 - Đã gỡ thành công vai trò Admin %1 người dùng trở lại làm thành viên\n\n%2',
      "removedNDH": '𝗠𝗢𝗗𝗘 - Đã gỡ thành công vai trò Người hỗ trợ %1 người dùng trở lại làm thành viên\n\n%2'

    },
    "en": {
        "listAdmin": '[Admin] Admin list: \n\n%1',
        "notHavePermssion": '[Admin] You have no permission to use "%1"',
        "addedNewAdmin": '[Admin] Added %1 Admin :\n\n%2',
        "removedAdmin": '[Admin] Remove %1 Admin:\n\n%2'
    }
}
module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'cache', 'data.json');
    if (!existsSync(path)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}
module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {  
    const content = args.slice(1, args.length);
    if (args.length == 0) return api.sendMessage({body:`==== [ إعدادات المشرف ] ====
\n━━━━━━━━━━━━━━━
\n𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗹𝗶𝘀𝘁 => عرض قائمة المشرفين والدعم
\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗮𝗱𝗱 => إضافة مستخدم كمشرف
\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗿𝗲𝗺𝗼𝘃𝗲=> إزالة دور المشرف
\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗮𝗱𝗱𝗻𝗱𝗵 => إضافة مستخدم كدعم
\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗿𝗲𝗺𝗼𝘃𝗲𝗻𝗱𝗵=> إزالة دور الدعم
\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗾𝘁𝘃𝗼𝗻𝗹𝘆=> تبديل الوضع لاستخدام البوت من قبل المشرفين فقط
\n𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗻𝗱𝗵𝗼𝗻𝗹𝘆=> تبديل الوضع لاستخدام البوت من قبل الدعم فقط
\n𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗼𝗻𝗹𝘆 => تبديل الوضع بحيث يمكن للمشرفين فقط استخدام البوت
\n𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗶𝗯𝗼𝗻𝗹𝘆 => تبديل الوضع بحيث يمكن للمشرفين فقط استخدام البوتات في IB بشكل منفصل عن البوتات
\n━━━━━━━━━━━━━━━
\n𝗛𝗗𝗦𝗗 => ${global.config.PREFIX} أوامر admin للاستخدام

    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { ADMINBOT } = global.config;
    const { NDH } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    switch (args[0]) {
        case "list":
        case "all":
        case "-a": { 
          listAdmin = ADMINBOT || config.ADMINBOT ||  [];
            var msg = [];
            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                  const name = (await Users.getData(idAdmin)).name
                    msg.push(`الاسم: ${name}\n» رابط فيسبوك: https://www.facebook.com/${idAdmin} 💌`);
                }
            }
          listNDH = NDH || config.NDH ||  [];
            var msg1 = [];
            for (const idNDH of listNDH) {
                if (parseInt(idNDH)) {
                  const name1 = (await Users.getData(idNDH)).name
                    msg1.push(`الاسم: ${name1}\n» رابط الفيسبوك: https://www.facebook.com/${idNDH} 🤖`);
                }
            }

            return api.sendMessage(getText("listAdmin", msg.join("\n\n"), msg1.join("\n\n")), threadID, messageID);
        }

       
        case "add": { 
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "add"), threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                ADMINBOT.push(content[0]);
                config.ADMINBOT.push(content[0]);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("تم اضافة ادمن جديد 🫠", 1, `ادمن - ${name}`), threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }
        case "addndh": { 
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "addndh"), threadID, messageID);
          if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];
                for (const id of mention) {
                    NDH.push(id);
                    config.NDH.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewNDH", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                NDH.push(content[0]);
                config.NDH.push(content[0]);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewNDH", 1, `𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗿𝘀 - ${name}`), threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
                  }
                case "remove":
        case "rm":
        case "delete": {
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "delete"), threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item == id);
                    ADMINBOT.splice(index, 1);
                    config.ADMINBOT.splice(index, 1);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
                ADMINBOT.splice(index, 1);
                config.ADMINBOT.splice(index, 1);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", 1, `${content[0]} - ${name}`), threadID, messageID);
            }
            else global.utils.throwError(this.config.name, threadID, messageID);
            }

        case "removendh":{
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "removendh"), threadID, messageID);
                    if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.NDH.findIndex(item => item == id);
                    NDH.splice(index, 1);
                    config.NDH.splice(index, 1);
                    listAdd.push(`${id} -${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedNDH", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.NDH.findIndex(item => item.toString() == content[0]);
                NDH.splice(index, 1);
                config.NDH.splice(index, 1);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedNDH", 1, `${content[0]} - ${name}`), threadID, messageID);
            }
            else global.utils.throwError(this.config.name, threadID, messageID);
  }
        case 'qtvonly': {
       const { resolve } = require("path");
        const pathData = resolve(__dirname, 'cache', 'data.json');
        const database = require(pathData);
        const { adminbox } = database;   
          if (permssion < 1) return api.sendMessage("الوضع - حدود حقوق الزاوية 🎀 ", threadID, messageID);
        if (adminbox[threadID] == true) {
            adminbox[threadID] = false;
            api.sendMessage("𝗠𝗢𝗗𝗘 » تم تعطيل وضع QTV بنجاح، يمكن للجميع استخدام البوت 👀", threadID, messageID);
        } else {
            adminbox[threadID] = true;
            api.sendMessage("𝗠𝗢𝗗𝗘 » تم تفعيل وضع QTV فقط، يمكن للمسؤولين فقط استخدام البوتات 👀", threadID, messageID);
    }
        writeFileSync(pathData, JSON.stringify(database, null, 4));
        break;
    }
   case 'ndhonly':
        case '-ndh': {
            //---> CODE ADMIN ONLY<---//
   if (permssion < 2) return api.sendMessage(" 𝗠𝗢𝗗𝗘 - تبديل حقوق الحدود 🎀", threadID, messageID);       
            if (config.ndhOnly == false) {
                config.ndhOnly = true;
                api.sendMessage(`𝗠𝗢𝗗𝗘 » تم تفعيل وضع NDH فقط، يمكن فقط لدعم البوت استخدام البوت 👾`, threadID, messageID);
            } else {
                config.ndhOnly = false;
                api.sendMessage(`𝗠𝗢𝗗𝗘 » تم تعطيل وضع NDH فقط بنجاح، يمكن للجميع استخدام البوت 👾
`, threadID, messageID);
            }
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                break;
            }
            case 'ibonly': {
            if (permssion != 3) return api.sendMessage("𝗠𝗢𝗗𝗘 - تبديل حقوق الحدود 🎀", threadID, messageID);
                   if (config.adminPaOnly == false) {
                    config.adminPaOnly = true;
                    api.sendMessage("𝗠𝗢𝗗𝗘 » تم تفعيل وضع الـ Ib فقط بنجاح، يمكن للمسؤولين فقط استخدام البوتات في صندوق الوارد الخاص بهم 💬", threadID, messageID);
                } else {
                    config.adminPaOnly = false;
                    api.sendMessage("[ 𝐌𝐎𝐃𝐄 ] » تم تعطيل وضع الـ Ib فقط بنجاح، يمكن للجميع استخدام البوت في صندوق الوارد الخاص بهم 💬", threadID, messageID);
                }
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        case 'only':
        case '-o': {
            //---> CODE ADMIN ONLY<---//
          if (permssion != 3) return api.sendMessage("𝗠𝗢𝗗𝗘 -  تبديل حقوق الحدود 🎀", threadID, messageID);
            if (config.adminOnly == false) {
                config.adminOnly = true;
                api.sendMessage(`𝗠𝗢𝗗𝗘 - تم تفعيل وضع المسؤولين فقط بنجاح، يمكن للمسؤولين فقط استخدام البوتات 👑`, threadID, messageID);
            } else {
                config.adminOnly = false;
                api.sendMessage(`𝗠𝗢𝗗𝗘 - تم تعطيل وضع المسؤولين فقط بنجاح، يمكن للجميع استخدام البوت 👑`, threadID, messageID);
            }
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                break;
              }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    };
      }
      
