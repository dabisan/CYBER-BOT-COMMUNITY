const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "زوجني",
    version: "1.0",
    hasPermssion: 0,
    credits: "يونو",
    description: "يزوجك مع شخص عشوائي من الجروب",
    commandCategory: "مرح",
    usages: "",
    cooldowns: 5,
  },

  run: async function ({ api, event }) {
    const threadID = event.threadID;
    const senderID = event.senderID;

    // جلب معلومات الجروب
    const threadInfo = await api.getThreadInfo(threadID);
    let members = threadInfo.participantIDs;

    // إزالة صاحب الأمر من القائمة لاختياره لاحقًا
    const filtered = members.filter(id => id != senderID);

    // اختيار شخص عشوائي من الأعضاء
    const randomPartnerID = filtered[Math.floor(Math.random() * filtered.length)];

    // جلب معلومات العضوين
    const usersInfo = await api.getUserInfo(senderID, randomPartnerID);
    const senderName = usersInfo[senderID].name;
    const partnerName = usersInfo[randomPartnerID].name;

    // روابط صور الملفات الشخصية
    const senderAvatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
    const partnerAvatar = `https://graph.facebook.com/${randomPartnerID}/picture?width=512&height=512`;

    // تحميل الصور مؤقتاً
    const downloadImage = async (url, path) => {
      const response = await axios.get(url, { responseType: 'stream' });
      return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    };

    const senderPath = path.join(__dirname, "cache", `${senderID}.jpg`);
    const partnerPath = path.join(__dirname, "cache", `${randomPartnerID}.jpg`);

    if (!fs.existsSync(path.dirname(senderPath))) {
      fs.mkdirSync(path.dirname(senderPath), { recursive: true });
    }

    await Promise.all([
      downloadImage(senderAvatar, senderPath),
      downloadImage(partnerAvatar, partnerPath),
    ]);

    // عبارات ظريفة عشوائية
    const phrases = [
      "مبروك الزواج السعيد! لا تنسوا شهر العسل في جروبنا!",
      "رب صدفة خير من ألف ميعاد... تم الزواج!",
      "حب في الجروب، زواج في البوت!",
      "الله يديم المحبة بينكم... البوت شهد على العقد!",
      "تم الزواج بنجاح، وين الكوشة؟",
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    // إرسال الرسالة مع الصورتين
    api.sendMessage({
      body: `💍 ${senderName} ❤ ${partnerName}\n${randomPhrase}`,
      attachment: [
        fs.createReadStream(senderPath),
        fs.createReadStream(partnerPath),
      ],
    }, threadID, () => {
      // حذف الصور بعد الإرسال
      fs.unlinkSync(senderPath);
      fs.unlinkSync(partnerPath);
    }, event.messageID);
  }
};