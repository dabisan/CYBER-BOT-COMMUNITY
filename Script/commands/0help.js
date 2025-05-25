module.exports.config = {
  name: "مساعدة",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "يونو",
  description: "عرض جميع أوامر البوت أو تفاصيل أمر معين",
  commandCategory: "system",
  usages: "[اسم الأمر | رقم الصفحة | all | اسم التصنيف]",
  cooldowns: 5
};

module.exports.languages = {
  "ar": {
    "moduleInfo": `╭──────•◈•──────╮
│  معلومات الأمر  
│  
│● الاسم: %1
│● الاستخدام: %3
│● الوصف: %2
│● التصنيف: %4
│● وقت الانتظار: %5 ثانية
│● الصلاحية: %6
╰──────•◈•──────╯`,
    "user": "مستخدم",
    "adminGroup": "أدمن المجموعة",
    "adminBot": "أدمن البوت",
    "helpList": '[ يحتوي البوت على %1 أمرًا، استخدم: "%2مساعدة اسم_الأمر" لمعرفة طريقة الاستخدام! ]'
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || !body.toLowerCase().startsWith("مساعدة ")) return;

  const input = body.split(" ")[1]?.toLowerCase();
  if (!input || !commands.has(input)) return;

  const command = commands.get(input);
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  const permission = command.config.hasPermssion == 0
    ? getText("user")
    : command.config.hasPermssion == 1
    ? getText("adminGroup")
    : getText("adminBot");

  return api.sendMessage(getText("moduleInfo",
    command.config.name,
    command.config.description || "",
    `${prefix}${command.config.name} ${command.config.usages || ""}`,
    command.config.commandCategory || "غير مصنفة",
    command.config.cooldowns || 5,
    permission
  ), threadID, messageID);
};

module.exports.run = function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const input = args[0];
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  const pageSize = 15;

  if (input === "all") {
    const groupMap = new Map();
    for (const cmd of commands.values()) {
      const category = cmd.config.commandCategory?.toLowerCase() || "غير مصنفة";
      if (!groupMap.has(category)) groupMap.set(category, []);
      groupMap.get(category).push(cmd.config.name);
    }

    let msg = "✦ قائمة الأوامر حسب التصنيفات:\n\n";
    for (const [cat, cmds] of groupMap.entries()) {
      msg += `❄️ ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n${cmds.join(" • ")}\n\n`;
    }

    return api.sendMessage(`${msg}✦ استخدم: ${prefix}مساعدة [اسم الأمر أو رقم الصفحة]`, threadID, messageID);
  }

  if (input && isNaN(input)) {
    const category = input.toLowerCase();
    const filtered = Array.from(commands.values()).filter(cmd => cmd.config.commandCategory?.toLowerCase() === category);
    if (!filtered.length) return api.sendMessage(`لا توجد أوامر في تصنيف "${category}".`, threadID, messageID);

    const message = filtered.map(cmd => `• ${prefix}${cmd.config.name} - ${cmd.config.description || "بدون وصف"}`).join("\n");
    return api.sendMessage(`✦ قائمة أوامر تصنيف: ${category}\n\n${message}`, threadID, messageID);
  }

  const page = parseInt(input) || 1;
  const sortedCommands = Array.from(commands.values()).sort((a, b) => a.config.name.localeCompare(b.config.name, "ar"));
  const totalPages = Math.ceil(sortedCommands.length / pageSize);

  if (page < 1 || page > totalPages) return api.sendMessage("رقم الصفحة غير صالح.", threadID, messageID);

  const start = (page - 1) * pageSize;
  const commandsPage = sortedCommands.slice(start, start + pageSize);

  const message = commandsPage.map((cmd, index) =>
    `${start + index + 1}. ${prefix}${cmd.config.name} - ${cmd.config.description || "بدون وصف"}`
  ).join("\n");

  return api.sendMessage(
    `╭──────•◈•──────╮\n│ قائمة الأوامر (${page}/${totalPages})\n╰──────•◈•──────╯\n\n${message}\n\n✦ استخدم: ${prefix}مساعدة [اسم الأمر | رقم الصفحة | all | اسم التصنيف]`,
    threadID,
    messageID
  );
};