module.exports.config = {
  name: "قبول",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "يونو",
  description: "قبول أو حذف طلبات الصداقة باستخدام معرف فيسبوك",
  commandCategory: "bot id",
  usages: "uid",
  cooldowns: 0
};

module.exports.handleReply = async ({ handleReply, event, api }) => {
  const { author, listRequest } = handleReply;
  if (author != event.senderID) return;

  const args = event.body.trim().toLowerCase().split(/ +/);

  const form = {
    av: api.getCurrentUserID(),
    fb_api_caller_class: "RelayModern",
    variables: {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.floor(Math.random() * 10000).toString()
      },
      scale: 3,
      refresh_num: 0
    }
  };

  const success = [];
  const failed = [];

  if (args[0] === "add") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
    form.doc_id = "3147613905362928";
  } else if (args[0] === "del") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
    form.doc_id = "4108254489275063";
  } else {
    return api.sendMessage(
      "أوه لا! اختار: add أو del وبعدها رقم الطلب أو اكتبي all لو تريد الكل، جرب مرة ثانية!",
      event.threadID,
      event.messageID
    );
  }

  let targetIDs = args.slice(1);

  if (targetIDs[0] === "all") {
    targetIDs = listRequest.map((_, index) => (index + 1).toString());
  }

  for (const stt of targetIDs) {
    const index = parseInt(stt) - 1;
    const user = listRequest[index];
    if (!user) {
      failed.push(`لم أجد الطلب رقم ${stt} في القائمة.`);
      continue;
    }
    form.variables.input.friend_requester_id = user.node.id;
    form.variables = JSON.stringify(form.variables);
    try {
      const res = await api.httpPost("https://www.facebook.com/api/graphql/", form);
      const resData = JSON.parse(res);
      if (resData.errors) failed.push(user.node.name);
      else success.push(user.node.name);
    } catch {
      failed.push(user.node.name);
    }
    form.variables = JSON.parse(form.variables);
  }

  return api.sendMessage(
    `تم! لقد ${args[0] === "add" ? "قبلت" : "حذفت"} طلبات الصداقة لـ ${success.length} شخص:\n${success.join(
      "\n"
    )}${failed.length > 0 ? `\nولكن لم أتمكن من التعامل مع ${failed.length}:\n${failed.join("\n")}` : ""}`,
    event.threadID,
    event.messageID
  );
};

module.exports.run = async ({ event, api }) => {
  const moment = require("moment-timezone");
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  try {
    const res = await api.httpPost("https://www.facebook.com/api/graphql/", form);
    const listRequest = JSON.parse(res).data.viewer.friending_possibilities.edges;

    if (!listRequest.length) return api.sendMessage("ما في طلبات صداقة حالياً.", event.threadID);

    let msg = "طلبات الصداقة:\n";
    listRequest.forEach((user, i) => {
      msg += `\n${i + 1}. الاسم: ${user.node.name}\nالمعرف: ${user.node.id}\nالرابط: ${user.node.url.replace(
        "www.facebook",
        "fb"
      )}\nالوقت: ${moment(user.time * 1000).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n`;
    });

    return api.sendMessage(
      `${msg}\nرد على هذه الرسالة بـ: add أو del وبعدها رقم الطلب أو اكتب "all" للكل.`,
      event.threadID,
      (error, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          listRequest,
          author: event.senderID
        });
      },
      event.messageID
    );
  } catch (e) {
    return api.sendMessage("حدث خطأ أثناء جلب طلبات الصداقة.", event.threadID);
  }
};