module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Notification of bots or people entering groups without media"
};

module.exports.run = async function({ api, event }) {
    const { threadID } = event;

    // عند انضمام البوت نفسه
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`, threadID, api.getCurrentUserID());

        return api.sendMessage(
            `أهلاً وسهلاً في القروب يا مززز! 🤩✨

شكراً لإضافتي! أنا ✨يونا✨، مساعدتكم الخارقة! 
لرؤية الأوامر اكتبوا: ${global.config.PREFIX}اوامر
\n\n
رابط
مطوري:https://www.facebook.com/100084485225595 \n\n
يلا نفلها سوا! 🕺💃`, threadID);
    } else {
        try {
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};

            var mentions = [], nameArray = [], memLength = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }

            memLength.sort((a, b) => a - b);

            let msg = (typeof threadData.customJoin == "undefined") ?
                `يا هلا ومرحبا بـ {name}! 🌟

نورت القروب ✨"{threadName}"✨
أنت/ي العضو رقم {soThanhVien}! 

جهّز نفسك للوناسة والفلة والدردشة الحلوة! 
إذا احتجت شي، بس ناديني. أنا دايمًا هنا! 🤖❤️

#يونا_عمتك تحبك! 🫶` 
                : threadData.customJoin;

            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'أصدقاء' : 'صديق')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            return api.sendMessage({ body: msg, mentions }, threadID);
        } catch (e) {
            return console.log(e);
        }
    }
}