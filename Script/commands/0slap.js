const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "صفع",
  version: "1.1",
  credits: "allou Mohamed",
  hasPermssion: 0,
  description: "صفع شخص معين وليس مربع",
  usages: "صفع",
  commandCategory: "صور",
  cooldowns: 5,
  aliases: ["صفع"]
};

module.exports.run = async function({ event, message, usersData, args, getLang }) {
  const uid1 = event.senderID;

  if (event.type !== "message_reply") {
    return message.reply(getLang("noReply") || "رد على من تريد صفعه 🌝");
  }

  const uid2 = event.messageReply.senderID;

  try {
    const avatarURL1 = await usersData.getAvatarUrl(uid1);
    const avatarURL2 = await usersData.getAvatarUrl(uid2);

    const imgBuffer = await new DIG.Batslap().getImage(avatarURL1, avatarURL2);

    const tmpDir = path.resolve(__dirname, "tmp");
    await fs.ensureDir(tmpDir);

    const pathSave = path.join(tmpDir, `${uid1}_${uid2}_Batslap.png`);
    await fs.writeFile(pathSave, imgBuffer);

    const content = args.join(" ").replace(Object.keys(event.mentions || {})[0] || "", "").trim() || "إبلع يا حيوان 🌝";

    await message.reply({
      body: content,
      attachment: fs.createReadStream(pathSave)
    });

    await fs.unlink(pathSave);

  } catch (error) {
    console.error(error);
    return message.reply("حدث خطأ أثناء تنفيذ الأمر، حاول مرة أخرى.");
  }
};