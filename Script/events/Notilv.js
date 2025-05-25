module.exports.config = {
  name: "leaveNoti",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "رسالة عند مغادرة أو طرد أحد الأعضاء",
};

module.exports.run = async function({ api, event }) {
  const moment = require("moment-timezone");
  const time = moment().tz("Africa/Algiers").format("YYYY-MM-DD || HH:mm:ss");

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const userID = event.logMessageData.leftParticipantFbId;
    const authorID = event.author;
    const userName = (await api.getUserInfo(userID))[userID].name;
    const type = authorID === userID ? "غادر بنفسه" : "تم طرده";

    let msg = "";

    if (type === "تم طرده") {
      msg = `⚠️ إشعار طرد عاجل ⚠️\n\nالعضو *${userName}* للأسف طار من القروب مثل السهم!\n\nالزعل مش علينا، الزعل على الفرصة اللي ضاعت عليه!\n⏰ الوقت: ${time}\nالحالة: ${type}\n\nوداعًا يا أسطورة، القروب صار أهدى شوي`;
    } else {
      msg = `**خبر محزن**\n\nالعضو *${userName}* غادر القروب بكل هدوء...\n\nيمكن زهق، يمكن مشغول، يمكن نسى يشحن نت!\n⏰ الوقت: ${time}\nالحالة: ${type}\n\nراح تبقى ذكرى جميلة (إذا كنت تنشط أساسًا)`;
    }

    return api.sendMessage(msg, event.threadID);
  } catch (err) {
    console.log("خطأ في leaveNoti:", err);
  }
};