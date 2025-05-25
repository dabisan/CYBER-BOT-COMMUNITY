module.exports.config = {
  name: "احصاء",
  version: "1.0.0",
  hasPermssion: 2, // صلاحيات المدير
  credits: "المطور: يونو",
  description: "عرض إحصائيات عامة عن أرصدة المستخدمين",
  commandCategory: "economy",
  usages: "",
  cooldowns: 10
};

module.exports.run = async function({ api, event, Currencies }) {
  const { threadID, messageID } = event;

  try {
    const allData = await Currencies.getAll();
    if (!allData || allData.length === 0) {
      return api.sendMessage("لا توجد بيانات أرصدة لعرضها.", threadID, messageID);
    }

    let totalMoney = 0;
    let richestUser = null;
    let poorestUser = null;

    allData.forEach(user => {
      const money = user.money || 0;
      totalMoney += money;

      if (!richestUser || money > richestUser.money) {
        richestUser = user;
      }
      if (!poorestUser || money < poorestUser.money) {
        poorestUser = user;
      }
    });

    const averageMoney = (totalMoney / allData.length).toFixed(2);

    let message = "📊 إحصائيات أرصدة المستخدمين:\n\n";
    message += `👑 أغنى مستخدم: ${richestUser.userID} - الرصيد: ${richestUser.money}\n`;
    message += `🪙 أفقر مستخدم: ${poorestUser.userID} - الرصيد: ${poorestUser.money}\n`;
    message += `💰 مجموع الأرصدة: ${totalMoney}\n`;
    message += `⚖️ متوسط الرصيد: ${averageMoney}\n`;
    message += `👥 عدد المستخدمين: ${allData.length}\n`;

    api.sendMessage(message, threadID, messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("حدث خطأ أثناء جلب إحصائيات الرصيد.", threadID, messageID);
  }
};