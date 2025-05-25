const fs = require("fs");
module.exports.config = {
  name: "yunaResponse",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "يرد على يونا فقط لصاحب ايدي معين",
  commandCategory: "no prefix",
  usages: "يونا or yuna",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  const { threadID, messageID, senderID, body } = event;

  // نتأكد من وجود نص في الرسالة
  if (!body) return;

  // نص الرسالة بحروف صغيرة لتسهيل المقارنة
  const text = body.toLowerCase();

  // نفعل فقط لو الإيدي هو المطلوب
  if (senderID === "100084485225595") {
    if (text === "يونا" || text === "yuna") {
      const msg = {
        body: "عمي شخبارك🤭🩷،عيوني يا حبي انت👀🥀،بدك شي حب؟🫠",
        // لو حابب تضيف مرفقات تكتبها هنا
        // attachment: fs.createReadStream(__dirname + `/path/to/file`)
      };
      api.sendMessage(msg, threadID, messageID);
      // تفاعل ممكن تحطه إذا حابب
      api.setMessageReaction("❤️", messageID, (err) => {}, true);
    }
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // لو بدك تستخدم الأمر بالكتابة مع البريفكس، تكتب هنا
};