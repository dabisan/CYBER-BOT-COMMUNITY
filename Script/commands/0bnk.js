module.exports.config = {
  name: "بنك",
  version: "1.0",
  credits: "يونو",
  hasPermission: 0,
  description: "إدارة البنك (تسجيل، إيداع، سحب، قرض، تحويل)",
  usages: "بنك <خدمة> <مبلغ>",
  commandCategory: "الألعاب",
  cooldowns: 5,
  aliases: ["bank"]
};

module.exports.run = async function ({ api, event, args, usersData, threadsData, message }) {
  const الخدمات = `1: تسجيل\n2: إيداع\n3: عرض\n4: سحب\n5: قرض\n6: سداد القرض\n7: تحويل\n8: استرداد (قريباً)\n══════ البنك ══════\n• الفائدة تلقائية: => 10 رسائل تحصل على فائدة 50 د.ج\n❗ فقط لمن سجل في البنك`;

  const الخدمة = args[0];
  if (!الخدمة) return message.reply(`قائمة الخدمات المتاحة:\n${الخدمات}`);

  const المبلغ = parseInt(args[1]);
  const id = event.senderID;

  // استرداد
  if (["استرداد"].includes(الخدمة)) {
    if (["تشغيل"].includes(args[1])) {
      await threadsData.set(event.threadID, true, "settings.sendBankRedeem");
      return message.reply("تم تشغيل وضع الاسترداد ✓");
    }
    if (["إيقاف"].includes(args[1])) {
      await threadsData.set(event.threadID, false, "settings.sendBankRedeem");
      return message.reply("تم إيقاف وضع الاسترداد ✓");
    }
  }

  // تسجيل
  if (["تسجيل", "سجل"].includes(الخدمة)) {
    const userMoney = await usersData.get(id, "money") || 0;
    const cost = 2000;
    if (userMoney < cost) return message.reply(`تحتاج إلى ${cost} د.ج للتسجيل في البنك.`);
    const username = await usersData.getName(id);
    await usersData.set(id, true, "data.has_bank_acc");
    await usersData.subtractMoney(id, cost);
    return message.reply(`تم تسجيلك في البنك بنجاح، ${username}!`);
  }

  // التحقق من التسجيل في البنك
  const isRegistered = await usersData.get(id, "data.has_bank_acc");
  if (isRegistered !== true) return message.reply("يجب عليك التسجيل في البنك أولاً.");

  // إيداع
  if (["إيداع", "تخزين", "وضع"].includes(الخدمة)) {
    if (!المبلغ) return message.reply('كم المبلغ الذي ترغب في إيداعه؟');
    const res = await إيداع_في_البنك(المبلغ, usersData, id);
    return message.reply(res);
  }

  // سحب
  if (["سحب", "أخذ"].includes(الخدمة)) {
    if (!المبلغ) return message.reply('كم المبلغ الذي ترغب في سحبه؟');
    const res = await سحب_من_البنك(المبلغ, usersData, id);
    return message.reply(res);
  }

  // عرض الرصيد
  if (["عرض"].includes(الخدمة)) {
    const balance = await usersData.get(id, "data.BankBal") || 0;
    return message.reply(`رصيدك البنكي الحالي هو: ${balance} د.ج`);
  }

  // قرض
  if (["قرض"].includes(الخدمة)) {
    const hasLoan = await usersData.get(id, "data.LoanSt");
    if (hasLoan === true) return message.reply("لديك قرض قائم بالفعل. يرجى سداده أولاً.");
    const loanAmount = 4000;
    const res = await إضافة_قرض(loanAmount, usersData, id);
    return message.reply(res);
  }

  // سداد القرض
  if (["سداد", "سدادالقرض"].includes(الخدمة)) {
    const res = await سداد_القرض(id, usersData);
    return message.reply(res);
  }

  // تحويل
  if (["تحويل"].includes(الخدمة)) {
    if (event.type !== "message_reply") return message.reply("يرجى الرد على رسالة المستخدم الذي ترغب في تحويل المال إليه.");
    const To = event.messageReply.senderID;
    const res = await تحويل_مال(id, To, usersData, المبلغ, api);
    return message.reply(res);
  }
};

// الدوال المساعدة

async function سحب_من_البنك(المبلغ, usersData, id) {
  try {
    let الرصيد_الحالي = await usersData.get(id, "money") || 0;
    let رصيد_البنك = await usersData.get(id, "data.BankBal") || 0;
    if (isNaN(المبلغ)) return 'يرجى إدخال رقم صالح.';
    if (المبلغ > رصيد_البنك) return 'المبلغ المطلوب أكبر من رصيدك البنكي.';
    await usersData.set(id, رصيد_البنك - المبلغ, "data.BankBal");
    await usersData.addMoney(id, المبلغ);
    return `تم سحب ${المبلغ} د.ج من حسابك البنكي.`;
  } catch (error) {
    console.error(error.message);
    return `حدث خطأ: ${error.message}`;
  }
}

async function إيداع_في_البنك(المبلغ, usersData, id) {
  try {
    if (isNaN(المبلغ)) return 'يرجى إدخال رقم صالح.';
    let رصيد_البنك = await usersData.get(id, "data.BankBal") || 0;
    let الرصيد_الحالي = await usersData.get(id, "money") || 0;
    if (المبلغ > الرصيد_الحالي) return 'لا يوجد لديك هذا المبلغ في رصيدك.';
    let رصيد_جديد = رصيد_البنك + المبلغ;
    await usersData.set(id, رصيد_جديد, "data.BankBal");
    await usersData.subtractMoney(id, المبلغ);
    return `تم إيداع ${المبلغ} د.ج في حسابك البنكي بنجاح.`;
  } catch (error) {
    console.error(error.message);
    return `حدث خطأ: ${error.message}`;
  }
}

async function إضافة_قرض(المبلغ, usersData, id) {
  let رصيد_البنك = await usersData.get(id, "data.BankBal") || 0;
  await usersData.set(id, رصيد_البنك + المبلغ, "data.BankBal");
  await usersData.set(id, Date.now(), "data.LoanDate");
  await usersData.set(id, true, "data.LoanSt");
  return `تم منحك قرض بقيمة ${المبلغ} د.ج. يرجى سداد القرض خلال 4 ساعات لتجنب العقوبات.`;
}

async function سداد_القرض(id, usersData) {
  const الرصيد_الحالي = await usersData.get(id, "money") || 0;
  if (الرصيد_الحالي < 4000) return 'لا تملك المال الكافي لسداد القرض.';
  await usersData.subtractMoney(id, 4000);
  await usersData.set(id, false, "data.LoanSt");
  await usersData.set(id, null, "data.LoanDate");
  return 'تم سداد القرض بنجاح.';
}

async function تحويل_مال(from, to, usersData, المبلغ, api) {
  if (from == to) return "لا يمكنك تحويل المال إلى نفسك.";
  const رصيد_المرسل = await usersData.get(from, "data.BankBal") || 0;
  const رصيد_المستلم = await usersData.get(to, "data.BankBal") || 0;
  const اسم_المستلم = await usersData.getName(to);
  const اسم_المرسل = await usersData.getName(from);
  if (isNaN(المبلغ) || المبلغ < 1000) return 'المبلغ يجب أن يكون أكبر من 1000 د.ج.';
  if (المبلغ > رصيد_المرسل) return 'المبلغ المطلوب أكبر من رصيدك البنكي.';
  await usersData.set(from, رصيد_المرسل - المبلغ, "data.BankBal");
  await usersData.set(to, رصيد_المستلم + المبلغ, "data.BankBal");
  api.sendMessage(`تم تحويل ${المبلغ} د.ج من ${اسم_المرسل} إلى ${اسم_المستلم}.`, to);
  return 'تمت عملية التحويل بنجاح.';
}