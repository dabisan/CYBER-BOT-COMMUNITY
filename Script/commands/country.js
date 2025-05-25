const fs = require("fs");

module.exports.config = {
  name: "اعلام",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "لعبة تخمين اسم الدولة من العلم + نظام نقاط",
  commandCategory: "ألعاب",
  usages: "اعلام أو اعلام قائمة",
  cooldowns: 5
};

const flagsList = [
  { emoji: "🇸🇦", name: "السعودية" },
  { emoji: "🇪🇬", name: "مصر" },
  { emoji: "🇸🇾", name: "سوريا" },
  { emoji: "🇮🇶", name: "العراق" },
  { emoji: "🇱🇧", name: "لبنان" },
  { emoji: "🇲🇦", name: "المغرب" },
  { emoji: "🇩🇿", name: "الجزائر" },
  { emoji: "🇹🇳", name: "تونس" },
  { emoji: "🇰🇼", name: "الكويت" },
  { emoji: "🇶🇦", name: "قطر" },
  { emoji: "🇦🇪", name: "الإمارات" },
  { emoji: "🇴🇲", name: "عمان" },
  { emoji: "🇾🇪", name: "اليمن" },
  { emoji: "🇯🇴", name: "الأردن" },
  { emoji: "🇹🇷", name: "تركيا" },
  { emoji: "🇵🇸", name: "فلسطين" },
  { emoji: "🇯🇵", name: "اليابان" },
  { emoji: "🇨🇳", name: "الصين" },
  { emoji: "🇺🇸", name: "أمريكا" },
  { emoji: "🇬🇧", name: "بريطانيا" },
  { emoji: "🇫🇷", name: "فرنسا" },
  { emoji: "🇧🇷", name: "البرازيل" },
  { emoji: "🇷🇺", name: "روسيا" },
  { emoji: "🇮🇳", name: "الهند" },
  { emoji: "🇰🇷", name: "كوريا الجنوبية" }
];

const scoresFile = __dirname + "/flag_scores.json";
let scores = fs.existsSync(scoresFile) ? JSON.parse(fs.readFileSync(scoresFile)) : {};

let currentAnswer = null;

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;

  if (body && body.toLowerCase().includes("قائمة")) {
    // عرض قائمة الفائزين
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return api.sendMessage("لا يوجد فائزين بعد.", threadID);

    let msg = "🏆 قائمة الفائزين:\n";
    sorted.slice(0, 10).forEach(([id, score], index) => {
      msg += `${index + 1}. ${id}: ${score} نقطة\n`;
    });

    return api.sendMessage(msg, threadID);
  }

  // لعبة تخمين علم
  const randomFlag = flagsList[Math.floor(Math.random() * flagsList.length)];
  currentAnswer = randomFlag.name;

  api.sendMessage(
    `🌍 خمن اسم الدولة من العلم التالي:\n${randomFlag.emoji}`,
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID,
        threadID,
        type: "guess"
      });
    }
  );
};

module.exports.handleReply = function({ api, event, handleReply }) {
  const { body, threadID, senderID } = event;

  if (handleReply.type === "guess") {
    if (!currentAnswer) return;

    if (body.trim() === currentAnswer) {
      // احسب النقطة
      scores[senderID] = (scores[senderID] || 0) + 1;
      fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));

      api.sendMessage(
        `✅ صحيح! ${body} هي الإجابة!\nالفائز: ${senderID} (+1 نقطة)\nإجمالي نقاطك: ${scores[senderID]}`,
        threadID
      );

      currentAnswer = null;
    } else {
      api.sendMessage(`❌ خطأ. حاول مرة أخرى!`, threadID);
    }
  }
};