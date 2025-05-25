module.exports.config = {
  name: "مسح",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "يونو",
  description: "حذف رسالة أرسلها البوت",
  commandCategory: "system",
  usages: "رد على الرسالة التي تريد مسحها",
  cooldowns: 0
};

module.exports.languages = {
  "ar": {
    "returnCant": "هههه حلوة، تبغاني أمسح رسالة مو أنا اللي كتبتها؟ مو شغلي!",
    "missingReply": "طيب وين الرسالة؟ رد على الرسالة اللي تبغاني أمسحها يا نجم!"
  }
};

module.exports.run = function({ api, event, getText }) {
  if (event.type !== "message_reply")
    return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
  
  if (event.messageReply.senderID !== api.getCurrentUserID())
    return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);
  
  return api.unsendMessage(event.messageReply.messageID);
}