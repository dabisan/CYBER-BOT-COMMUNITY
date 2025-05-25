module.exports.config = {
    name: "غادر",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "يونو",
    description: "خروج البوت أو حذف مجموعة معينة",
    commandCategory: "الإدارة",
    usages: "غادر [معرف_المجموعة]",
    cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
    // إذا لم يعطِ المستخدم معرف مجموعة، يغادر البوت من المجموعة الحالية
    if (!args[0]) {
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    }
    // إذا أعطى معرف رقم (رقم مجموعة) يغادر منها
    if (!isNaN(args[0])) {
        const groupID = args[0];
        return api.removeUserFromGroup(api.getCurrentUserID(), groupID);
    }
};