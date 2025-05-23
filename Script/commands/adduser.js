module.exports.config = {
  name: "اضف",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Add user to a Facebook group by user ID or group invite link",
  commandCategory: "group",
  usages: "[userID or inviteLink]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  if (!args[0]) return api.sendMessage("يرجى إدخال معرف المستخدم أو رابط الدعوة.", event.threadID);

  const input = args[0];

  // التحقق إذا كان الإدخال رابط دعوة مجموعة فيسبوك
  const inviteCodeMatch = input.match(/facebook\.com\/groups\/(\d+)\/invite\/(\w+)/i);

  try {
    if (inviteCodeMatch) {
      // لو هو رابط دعوة، نجلب كود الدعوة
      const groupID = inviteCodeMatch[1];
      const inviteCode = inviteCodeMatch[2];

      // نستخدم API لإضافة المستخدم بناء على الدعوة
      await api.addUserToGroupByInvite(event.senderID, inviteCode);
      return api.sendMessage(`تمت إضافة المستخدم للدردشة عبر رابط الدعوة في المجموعة ${groupID}`, event.threadID);

    } else if (/^\d+$/.test(input)) {
      // لو الإدخال رقم فقط (معرف مستخدم)
      const userID = input;
      await api.addUserToGroup(event.threadID, userID);
      return api.sendMessage(`تمت إضافة المستخدم ${userID} إلى المجموعة.`, event.threadID);

    } else {
      return api.sendMessage("يرجى إدخال معرف مستخدم صحيح أو رابط دعوة صحيح.", event.threadID);
    }
  } catch (error) {
    return api.sendMessage(`حدث خطأ أثناء محاولة الإضافة: ${error.message}`, event.threadID);
  }
};
