module.exports.config = {
	name: "رصيد",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝐘𝐔𝐍𝐎 ⚠️",
	description: "عرض رصيدك أو رصيد شخص تم الإشارة إليه",
	commandCategory: "الاقتصاد",
	usages: "[إشارة]",
	cooldowns: 5
};

module.exports.languages = {
	vi: {
		sotienbanthan: "رصيدك الحالي هو: %1$",
		sotiennguoikhac: "رصيد %1 هو: %2$"
	},
	en: {
		sotienbanthan: "Your current balance: %1$",
		sotiennguoikhac: "%1's current balance: %2$."
	},
	ar: {
		sotienbanthan: "رصيدك الحالي هو: %1$",
		sotiennguoikhac: "رصيد %1 هو: %2$"
	}
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
	const { threadID, messageID, senderID, mentions } = event;

	try {
		// الحالة 1: بدون وسوم - عرض رصيد المستخدم نفسه
		if (!args[0]) {
			const money = (await Currencies.getData(senderID)).money || 0;
			return api.sendMessage(getText("sotienbanthan", money), threadID, messageID);
		}

		// الحالة 2: وسم واحد فقط
		if (Object.keys(mentions).length === 1) {
			const mentionID = Object.keys(mentions)[0];
			const name = mentions[mentionID].replace(/@/g, "");
			const money = (await Currencies.getData(mentionID)).money || 0;

			return api.sendMessage({
				body: getText("sotiennguoikhac", name, money),
				mentions: [{
					tag: name,
					id: mentionID
				}]
			}, threadID, messageID);
		}

		// الحالة 3: أكثر من وسم - غير مسموح
		return api.sendMessage("❌ يرجى الإشارة إلى شخص واحد فقط.", threadID, messageID);

	} catch (err) {
		console.error(err);
		return global.utils.throwError(this.config.name, threadID, messageID);
	}
};