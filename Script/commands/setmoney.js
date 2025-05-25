module.exports.config = {
	name: "مال",
	version: "0.0.1",
	hasPermssion: 2,
	credits: "𝐘𝐔𝐍𝐎 ⚠️",
	description: "تغيير رصيدك أو رصيد شخص تم الإشارة إليه",
	commandCategory: "النظام",
	usages: "مال [أنا | حذف | UID | @شخص]",
	cooldowns: 5,
	info: [
		{
			key: 'Tag',
			prompt: 'اتركه فارغًا أو أشر إلى شخص، يمكنك الإشارة لأكثر من شخص',
			type: 'Document',
			example: '@اسم'
		}
	]
};

module.exports.run = async function({ api, event, args, Currencies, utils, Users }) {
	const mention = Object.keys(event.mentions)[0];
	const prefix = ";";
	const { body, senderID, threadID, messageID } = event;

	// استخراج الرصيد من الرسالة
	const المحتوى = body.slice(prefix.length + 4); // "مال " = 4 حروف
	const المُرسل = المحتوى.slice(0, المحتوى.lastIndexOf(" "));
	const المبلغ = المحتوى.substring(المحتوى.lastIndexOf(" ") + 1);

	// حالة تغيير رصيدك أنت
	if (args[0] === 'انا') {
		await Currencies.increaseMoney(senderID, parseInt(المبلغ));
		return api.sendMessage(`✅ تم تغيير رصيدك إلى ${المبلغ} بنجاح.`, threadID, messageID);
	}

	// حالة حذف الرصيد بالكامل
	else if (args[0] === "حذف") {
		if (args[1] === 'me') {
			const رصيدي = (await Currencies.getData(senderID)).money || 0;
			await Currencies.decreaseMoney(senderID, رصيدي);
			return api.sendMessage(`✅ لقد أصبحت مفلسًا!\n💸 الرصيد الذي تم حذفه: ${رصيدي}.`, threadID, messageID);
		}
		else if (mention) {
			const رصيد_المذكور = (await Currencies.getData(mention)).money || 0;
			await Currencies.decreaseMoney(mention, رصيد_المذكور);
			const الاسم = event.mentions[mention].replace("@", "");
			return api.sendMessage(`✅ تم حذف رصيد ${الاسم} بالكامل.\n💸 الرصيد المحذوف: ${رصيد_المذكور}.`, threadID, messageID);
		}
		else {
			return api.sendMessage("❌ فشل: يجب الإشارة إلى شخص أو استخدام 'me'.", threadID, messageID);
		}
	}

	// حالة تغيير رصيد شخص مذكور بالإشارة
	else if (mention) {
		await Currencies.increaseMoney(mention, parseInt(المبلغ));
		const الاسم = event.mentions[mention].replace("@", "");
		return api.sendMessage({
			body: `✅ تم تغيير رصيد ${الاسم} إلى ${المبلغ}.`,
			mentions: [{
				tag: الاسم,
				id: mention
			}]
		}, threadID, messageID);
	}

	// حالة تغيير الرصيد عن طريق UID
	else if (args[0] === "UID") {
		const uid = args[1];
		const القيمة = args[2];
		const الاسم = (await Users.getData(uid)).name;
		await Currencies.increaseMoney(uid, parseInt(القيمة));
		return api.sendMessage(`✅ تم تغيير رصيد ${الاسم} إلى ${القيمة}.`, threadID, messageID);
	}

	// في حالة عدم المطابقة
	else {
		return api.sendMessage("❌ أمر غير مفهوم. تحقق من الصيغة.", threadID, messageID);
	}
};