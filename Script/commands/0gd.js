module.exports.config = {
    name: "حراسة",
    version: "1.0.0",
    credits: "Allou Mohamed",
    hasPermssion: 1,
    description: "تفعيل/إيقاف الحماية من سرقة الأدمن",
    usages: "حراسة",
    commandCategory: "الحماية",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["antirobbery"] == "undefined" || data["antirobbery"] == false) data["antirobbery"] = true;
    else data["antirobbery"] = false;

    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);

    return api.sendMessage(`✅ تم ${(data["antirobbery"] == true) ? "تشغيل" : "إيقاف"} الحماية من سرقة الأدمن!`, event.threadID);
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
    const threadID = event.threadID;
    const data = (await Threads.getData(threadID)).data || {};
    if (data["antirobbery"] != true || event.logMessageType != "log:thread-admins" || event.author == api.getCurrentUserID()) return;

    const isAdd = event.logMessageData.ADMIN_EVENT == "add_admin";
    const isRemove = event.logMessageData.ADMIN_EVENT == "remove_admin";

    if (isRemove) {
        const thief = event.author;
        const target = event.logMessageData.TARGET_ID;
        try {
            await api.changeAdminStatus(threadID, target, true);
            await api.changeAdminStatus(threadID, thief, false);
            api.sendMessage("غبي ما يعرف أن الجروب في وضع حماية من السرقة هه 🌝", threadID);
        } catch (err) {
            api.sendMessage(err.message, threadID);
        }
    }

    if (isAdd) {
        const author = event.author;
        const target = event.logMessageData.TARGET_ID;
        try {
            await api.changeAdminStatus(threadID, author, false);
            await api.changeAdminStatus(threadID, target, false);
            api.sendMessage("إحتمال ضفته تسوو علينا إنقلاب سوو شلتك أنت و هو آسف حماية شغالة 🌝", threadID);
        } catch (err) {
            api.sendMessage(err.message, threadID);
        }
    }
};