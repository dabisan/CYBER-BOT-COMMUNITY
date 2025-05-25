module.exports.config = {
    name: "عمل",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "يونو", 
    description: "وظائف لطيفة لربح العملات",
    commandCategory: "الاقتصاد",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};

module.exports.languages = {
    "ar": {
        "cooldown": "🌙 هدي شوي يا نجم، جرب بعد: %1 دقيقة و %2 ثانية ⏳"
    }
};

module.exports.handleReply = async ({ event, api, handleReply, Currencies }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};

    var coinscn = Math.floor(Math.random() * 401) + 200;
    var coinsdv = Math.floor(Math.random() * 801) + 200;
    var coinsmd = Math.floor(Math.random() * 401) + 200;
    var coinsq = Math.floor(Math.random() * 601) + 200;
    var coinsdd = Math.floor(Math.random() * 201) + 200;
    var coinsdd1 = Math.floor(Math.random() * 801) + 200;

    var rdcn = ['مشرف عمال', 'مدير فندق', 'في محطة كهرباء', 'شيف مطعم', 'عامل نشيط'];
    var rddv = ['سباك', 'تصليح مكيفات', 'بيع هراء هرمي', 'توزيع منشورات', 'شيبّر سريع', 'تقني كمبيوتر', 'مرشد سياحي', 'ترضيع طفل غريب'];
    var rdmd = ['استخراج 13 برميل نفط', 'استخراج 8 براميل نفط', 'سرقة نفط', 'تعبئة مياه وبيعها كنفط'];
    var rdq = ['خام الحديد', 'خام الذهب', 'فحم', 'رصاص', 'نحاس', 'نفط'];
    var rddd = ['ألماس', 'ذهب', 'فحم', 'زمرد', 'حديد', 'حجر عادي', 'كسلان', 'حجر أزرق'];
    var rddd1 = ['زبون VIP', 'براءة اختراع', 'شخص غريب', 'غبي عمره 23', 'العملاق الثري', 'طفل عمره 12'];

    var msg = "";
    switch (handleReply.type) {
        case "choosee": {
            switch (event.body) {
                case "1":
                    msg = `🏭 وااو! اشتغلت كـ ${rdcn[Math.floor(Math.random() * rdcn.length)]} بالمنطقة الصناعية و ربحت ${coinscn}$ عملة! 💰`;
                    Currencies.increaseMoney(senderID, coinscn);
                    break;
                case "2":
                    msg = `🛍️ ووه! اشتغلت كـ ${rddv[Math.floor(Math.random() * rddv.length)]} تبيع زلابية و شربات في بوفاريك وربحت ${coinsdv}$ ! 🍩`;
                    Currencies.increaseMoney(senderID, coinsdv);
                    break;
                case "3":
                    msg = `⛽ وااااه! اشتغلت كـ ${rdmd[Math.floor(Math.random() * rdmd.length)]} وربحت ${coinsmd}$ نفطية!`;
                    Currencies.increaseMoney(senderID, coinsmd);
                    break;
                case "4":
                    msg = `⛏️ يا حفّار! لقيت ${rdq[Math.floor(Math.random() * rdq.length)]} وربحت ${coinsq}$ !`;
                    Currencies.increaseMoney(senderID, coinsq);
                    break;
                case "5":
                    msg = `🪨 حفرت و لقيت ${rddd[Math.floor(Math.random() * rddd.length)]} وربحت ${coinsdd}$ !`;
                    Currencies.increaseMoney(senderID, coinsdd);
                    break;
                case "6":
                    msg = `✨ قابلت ${rddd1[Math.floor(Math.random() * rddd1.length)]} و عطاك ${coinsdd1}$ كهدية! 🎁`;
                    Currencies.increaseMoney(senderID, coinsdd1);
                    break;
                case "7":
                    msg = "🚧 ميزة قيد التطوير، تابعنا قريبا يا نجم!";
                    break;
                default:
                    return api.sendMessage("❗ رجاءً اختر رقم صحيح يا نجم!", threadID, messageID);
            }

            const choose = parseInt(event.body);
            if (isNaN(choose)) return api.sendMessage("❗ لازم تكتب رقم مش كلام يا حلو!", threadID, messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("❗ مفيش وظيفة بهالرقم، جرب تاني!", threadID, messageID);

            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(msg, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        }
    }
};

module.exports.run = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    if (cooldown - (Date.now() - data.work2Time) > 0) {
        let time = cooldown - (Date.now() - data.work2Time),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0);
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
    } else {
        return api.sendMessage(
            "✨ مركز الوظائف السحرية! اختار وين تحب تشتغل؟\n\n" +
            "1. المنطقة الصناعية 🏭\n" +
            "2. منطقة الخدمات 🛍️\n" +
            "3. حقل النفط ⛽\n" +
            "4. منجم الخامات ⛏️\n" +
            "5. حفر الصخور 🪨\n" +
            "6. مغامرة عشوائية ✨\n" +
            "7. قريباً جداً... ⏳\n\n" +
            "💬 رد على هذه الرسالة برقم الوظيفة اللي تحبها!",
            threadID, (error, info) => {
                global.client.handleReply.push({
                    type: "choosee",
                    name: this.config.name,
                    author: senderID,
                    messageID: info.messageID
                });
            }
        );
    }
};