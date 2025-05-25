module.exports.config = {
    name: "سلوت",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "CYBER - ChatGPT Edit",
    description: "لعبة سلوت لطيفة للفوز بالعملات",
    commandCategory: "ألعاب",
    usages: "[المبلغ]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;
    const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const userData = await getData(senderID);
    const userMoney = userData.money;

    let betAmount = parseInt(args[0]);

    // التحقق من صحة المبلغ
    if (isNaN(betAmount) || betAmount <= 0) {
        return api.sendMessage("❌ عفوًا! لازم تكتب مبلغ صحيح ترا! جرب مرة ثانية يا جميل 💸", threadID, messageID);
    }
    if (betAmount > userMoney) {
        return api.sendMessage("😿 مافيك تكذب علينا! رصيدك ما يكفي للمراهنة بهالمبلغ! حاول بمبلغ أقل يا كيوت 💔", threadID, messageID);
    }
    if (betAmount < 50) {
        return api.sendMessage("⚠️ المبلغ قليل مرررة! الحد الأدنى للمراهنة هو 50 عملة فقط يا بطل 💰", threadID, messageID);
    }

    // اختيار رموز عشوائية
    let numbers = [], win = false;
    for (let i = 0; i < 3; i++) {
        numbers[i] = Math.floor(Math.random() * slotItems.length);
    }

    // التحقق من الفوز
    if (numbers[0] === numbers[1] && numbers[1] === numbers[2]) {
        betAmount *= 9;
        win = true;
    } else if (numbers[0] === numbers[1] || numbers[0] === numbers[2] || numbers[1] === numbers[2]) {
        betAmount *= 2;
        win = true;
    }

    const result = `🎰 | ${slotItems[numbers[0]]} | ${slotItems[numbers[1]]} | ${slotItems[numbers[2]]} | 🎰`;

    if (win) {
        await increaseMoney(senderID, betAmount);
        return api.sendMessage(
            `${result}\n\nيا سلاااام! ربحت ${betAmount} عملة! مبروووك يا نجم ⭐️💸`,
            threadID,
            messageID
        );
    } else {
        await decreaseMoney(senderID, betAmount);
        return api.sendMessage(
            `${result}\n\nآآآه! خسرت ${betAmount} عملة... لا تحزن، الحظ بيضحكلك قريبًا إن شاء الله! 🍀😿`,
            threadID,
            messageID
        );
    }
};