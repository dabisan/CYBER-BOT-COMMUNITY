module.exports.config = {
  name: "سرقة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "المطور: يونو",
  description: "حاول سرقة مبلغ من رصيد مستخدم آخر مع نسبة نجاح وفشل",
  commandCategory: "economy",
  usages: "@الاسم [المبلغ]",
  cooldowns: 10
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID, mentions } = event;

  // التحقق من وجود وسم لشخص واحد
  if (Object.keys(mentions).length !== 1) {
    return api.sendMessage("يرجى الإشارة إلى شخص واحد فقط للسرقة منه.", threadID, messageID);
  }

  const victimID = Object.keys(mentions)[0];
  const amountToSteal = parseInt(args[1]);

  if (!amountToSteal || amountToSteal <= 0) {
    return api.sendMessage("يرجى تحديد مبلغ صحيح للسرقة.", threadID, messageID);
  }

  if (victimID === senderID) {
    return api.sendMessage("لا يمكنك سرقة نفسك!", threadID, messageID);
  }

  // جلب أرصدة الطرفين
  const senderData = await Currencies.getData(senderID);
  const victimData = await Currencies.getData(victimID);

  const senderMoney = senderData.money || 0;
  const victimMoney = victimData.money || 0;

  if (victimMoney < amountToSteal) {
    return api.sendMessage(`المستخدم ${event.mentions[victimID].replace("@", "")} لا يملك هذا المبلغ.`, threadID, messageID);
  }

  // تحديد نسبة نجاح السرقة (مثلاً 50%)
  const successChance = 0.5;
  const random = Math.random();

  if (random < successChance) {
    // نجاح السرقة - زيادة رصيد السارق، نقصان رصيد الضحية
    await Currencies.increaseMoney(senderID, amountToSteal);
    await Currencies.decreaseMoney(victimID, amountToSteal);

    return api.sendMessage(`نجحت في سرقة ${amountToSteal} من رصيد ${event.mentions[victimID].replace("@", "")}!`, threadID, messageID);
  } else {
    // فشل السرقة - خسارة السارق جزء من ماله (مثلاً 30% من المبلغ)
    const penalty = Math.floor(amountToSteal * 0.3);
    if (senderMoney < penalty) {
      return api.sendMessage(`فشلت في السرقة ولكن رصيدك أقل من غرامة الفشل (${penalty}).`, threadID, messageID);
    }
    await Currencies.decreaseMoney(senderID, penalty);

    return api.sendMessage(`فشلت في السرقة وخسرت ${penalty} كغرامة.`, threadID, messageID);
  }
};