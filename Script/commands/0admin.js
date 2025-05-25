const { readdirSync, readFileSync, writeFileSync, existsSync } = require("fs-extra");
const { resolve } = require("path");

module.exports.config = {
    name: "ادمن",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "يونو",
    description: "إعدادات المشرفين والداعمين",
    commandCategory: "الإدارة",
    usages: "[قائمة | إضافة | إزالة] [الرقم أو بالإشارة]",
    cooldowns: 3,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "vi": {
        "listAdmin": `===「 قائمة المشرفين والداعمين 」===\n\n» المشرفين:\n%1\n\n» الداعمين:\n%2`,
        "notHavePermssion": "ليس لديك صلاحية استخدام الأمر \"%1\"",
        "addedNewAdmin": "تمت إضافة %1 إلى قائمة المشرفين:\n\n%2",
        "addedNewNDH": "تمت إضافة %1 إلى قائمة الداعمين:\n\n%2",
        "removedAdmin": "تمت إزالة %1 من قائمة المشرفين:\n\n%2",
        "removedNDH": "تمت إزالة %1 من قائمة الداعمين:\n\n%2"
    }
};

module.exports.onLoad = function () {
    const path = resolve(__dirname, 'cache', 'data.json');
    if (!existsSync(path)) {
        writeFileSync(path, JSON.stringify({ adminbox: {} }, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
    const { threadID, messageID, mentions, type, messageReply } = event;
    const mentionIDs = Object.keys(mentions);
    const content = args.slice(1);
    const { configPath } = global.client;
    const { ADMINBOT, NDH } = global.config;
    const { writeFileSync } = require("fs-extra");

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);

    switch (args[0]) {
        case "قائمة":
        case "عرض":
        case "list":
        case "all":
        case "-a": {
            let msgAdmin = [], msgNDH = [];

            for (const id of ADMINBOT || config.ADMINBOT || []) {
                if (!isNaN(id)) {
                    const name = (await Users.getData(id)).name;
                    msgAdmin.push(`الاسم: ${name}\nرابط: https://www.facebook.com/${id}`);
                }
            }

            for (const id of NDH || config.NDH || []) {
                if (!isNaN(id)) {
                    const name = (await Users.getData(id)).name;
                    msgNDH.push(`الاسم: ${name}\nرابط: https://www.facebook.com/${id}`);
                }
            }

            return api.sendMessage(getText("listAdmin", msgAdmin.join("\n\n"), msgNDH.join("\n\n")), threadID, messageID);
        }

        case "إضافة":
        case "add": {
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "إضافة"), threadID, messageID);
            let idToAdd = content[0];

            if (type == "message_reply") idToAdd = messageReply.senderID;
            else if (mentionIDs.length > 0) idToAdd = mentionIDs[0];

            if (!idToAdd || isNaN(idToAdd)) return;

            if (!ADMINBOT.includes(idToAdd)) ADMINBOT.push(idToAdd);
            if (!config.ADMINBOT.includes(idToAdd)) config.ADMINBOT.push(idToAdd);

            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            const name = (await Users.getData(idToAdd)).name;
            return api.sendMessage(getText("addedNewAdmin", 1, `${name}`), threadID, messageID);
        }

        case "دعم":
        case "addndh": {
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "دعم"), threadID, messageID);
            let idToAdd = content[0];

            if (type == "message_reply") idToAdd = messageReply.senderID;
            else if (mentionIDs.length > 0) idToAdd = mentionIDs[0];

            if (!idToAdd || isNaN(idToAdd)) return;

            if (!NDH.includes(idToAdd)) NDH.push(idToAdd);
            if (!config.NDH.includes(idToAdd)) config.NDH.push(idToAdd);

            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            const name = (await Users.getData(idToAdd)).name;
            return api.sendMessage(getText("addedNewNDH", 1, `${name}`), threadID, messageID);
        }

        case "إزالة":
        case "remove":
        case "delete": {
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "إزالة"), threadID, messageID);
            let idToRemove = content[0];

            if (type == "message_reply") idToRemove = messageReply.senderID;
            else if (mentionIDs.length > 0) idToRemove = mentionIDs[0];

            if (!idToRemove || isNaN(idToRemove)) return;

            let index = ADMINBOT.indexOf(idToRemove);
            if (index !== -1) ADMINBOT.splice(index, 1);
            index = config.ADMINBOT.indexOf(idToRemove);
            if (index !== -1) config.ADMINBOT.splice(index, 1);

            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            const name = (await Users.getData(idToRemove)).name;
            return api.sendMessage(getText("removedAdmin", 1, `${name}`), threadID, messageID);
        }

        case "إزالةدعم":
        case "removendh": {
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "removendh"), threadID, messageID);
            let idToRemove = content[0];

            if (type == "message_reply") idToRemove = messageReply.senderID;
            else if (mentionIDs.length > 0) idToRemove = mentionIDs[0];

            if (!idToRemove || isNaN(idToRemove)) return;

            let index = NDH.indexOf(idToRemove);
            if (index !== -1) NDH.splice(index, 1);
            index = config.NDH.indexOf(idToRemove);
            if (index !== -1) config.NDH.splice(index, 1);

            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            const name = (await Users.getData(idToRemove)).name;
            return api.sendMessage(getText("removedNDH", 1, `${name}`), threadID, messageID);
        }

        default: {
            return api.sendMessage(
                `=== [ إعدادات المشرفين ] ===
                
استخدم الأوامر التالية:
- ${global.config.PREFIX}ادمن قائمة : عرض قائمة المشرفين والداعمين
- ${global.config.PREFIX}ادمن إضافة [بإشارة أو ID] : إضافة مشرف
- ${global.config.PREFIX}ادمن إزالة [بإشارة أو ID] : إزالة مشرف
- ${global.config.PREFIX}ادمن دعم [بإشارة أو ID] : إضافة داعم
- ${global.config.PREFIX}ادمن إزالةدعم [بإشارة أو ID] : إزالة داعم`,
                threadID,
                messageID
            );
        }
    }
};