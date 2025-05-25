module.exports.config = {
  name: "شخصية",
  version: "1.2",
  credits: "يونو",
  hasPermssion: 0,
  description: "لعبة معرفة شخصيات الأنمي",
  usages: "شخصية",
  commandCategory: "الألعاب",
  cooldowns: 5,
  aliases: ["c"]
};

module.exports.run = async function({ message, event, usersData }) {
  if (!global.Anime) global.Anime = {};

  // بيانات اللعبة مع الروابط وأسماء الشخصيات الجديدة
  const dataGame = [
    { Qname: "كيلوا", Qanswer: "https://i.imgur.com/g4799Ue.jpeg" },
    { Qname: "اكامي", Qanswer: "https://i.imgur.com/KsWTdDq.png" },
    { Qname: "ناروتو", Qanswer: "https://i.imgur.com/BHXJrDC.jpeg" },
    { Qname: "لوفي", Qanswer: "https://i.imgur.com/558XVrd.jpeg" },
    { Qname: "ميكاسا", Qanswer: "https://i.imgur.com/S6DEC5g.jpeg" }
  ];

  const TID = event.threadID;
  const randomIndex = Math.floor(Math.random() * dataGame.length);
  const data = dataGame[randomIndex];

  global.Anime[TID] = {
    quiz: data.Qname.toLowerCase(),
    answer: data.Qanswer
  };

  await message.reply({
    body: 'من هذه الشخصية؟ اكتب الاسم بالضبط.',
    attachment: await global.utils.getStreamFromURL(global.Anime[TID].answer)
  });
};

module.exports.handleReply = async function({ event, message, usersData }) {
  if (!global.Anime) return;

  const TID = event.threadID;
  const uid = event.senderID;

  if (!global.Anime[TID] || !global.Anime[TID].quiz) return;

  const userAnswer = event.body.toLowerCase().trim();
  const correctAnswer = global.Anime[TID].quiz;

  if (userAnswer === correctAnswer) {
    const oldPoints = await usersData.get(uid, "data.Qexp") || 0;
    await usersData.set(uid, oldPoints + 1, "data.Qexp");
    global.Anime[TID] = { quiz: null, answer: null };
    return message.reply(`أحسنت! الإجابة صحيحة.\nنقاطك الآن: ${oldPoints + 1}\nاطلب سؤال جديد بعد 10 ثوانٍ.`);
  } else {
    return message.reply("للأسف، الإجابة غير صحيحة. حاول مرة أخرى.");
  }
};