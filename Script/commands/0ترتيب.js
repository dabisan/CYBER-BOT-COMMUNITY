const fs = require("fs");

module.exports.config = {
  name: "ترتيب",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "لعبة ترتيب الحروف - رتب الكلمة لتكون صحيحة + نظام نقاط",
  commandCategory: "ألعاب",
  usages: "ترتيب",
  cooldowns: 5
};

const wordsList = [
  "تفاح",
  "برمجة",
  "كمبيوتر",
  "موبايل",
  "مدرسة",
  "جامعة",
  "كتاب",
  "قلم",
  "مكتبة",
  "سيارة",
  "طيارة",
  "هاتف",
  "شجرة",
  "مستشفى",
  "مدينة",
  "بحر",
  "نهر",
  "سماء",
  "قمر",
  "نجمة"
];

const scoresFile = __dirname + "/anagram_scores.json";
let scores = fs.existsSync(scoresFile) ? JSON.parse(fs.readFileSync(scoresFile)) : {};

let currentWord = null;
let scrambledWord = null;

function shuffleWord(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;

  // اختيار كلمة عشوائية وترتيب حروفها
  currentWord = wordsList[Math.floor(Math.random() * wordsList.length)];
  scrambledWord = shuffleWord(currentWord);

  // تأكد أن الكلمة المختلطة ليست نفسها الكلمة الأصلية
  while (scrambledWord === currentWord) {
    scrambledWord = shuffleWord(currentWord);
  }

  api.sendMessage(
    `🔤 رتب الحروف لتكون كلمة صحيحة:\n${scrambledWord}`,
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
    if (!currentWord) return;

    if (body.trim() === currentWord) {
      scores[senderID] = (scores[senderID] || 0) + 1;
      fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));

      api.sendMessage(
        `✅ صحيح! الكلمة هي: ${currentWord}\nمبروك! لقد حصلت على نقطة.\nإجمالي نقاطك: ${scores[senderID]}`,
        threadID
      );

      currentWord = null;
      scrambledWord = null;
    } else {
      api.sendMessage(`❌ خطأ. حاول مرة أخرى!`, threadID);
    }
  }
};