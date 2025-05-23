
module.exports.config = {
    name: "عمل",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", 
    description: "",
    commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};
module.exports.languages = {
    
    "en": {
        "cooldown": "You're done, come back later: %1 minute(s) %2 second(s)."
    }
}
module.exports.handleReply = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};
//random coins nhận được khi làm việc ít nhất 200
var coinscn = Math.floor(Math.random() * 401) + 200; //random coins khi làm ở khu công nghiệp
var coinsdv = Math.floor(Math.random() * 801) + 200; //random coins khi làm ở khu dịch vụ
var coinsmd = Math.floor(Math.random() * 401) + 200; //random coins khi làm ở mỏ dầu
var coinsq = Math.floor(Math.random() * 601) + 200; //random coins khi khai thác quặng
var coinsdd = Math.floor(Math.random() * 201) + 200; //random coins khi đào đá
var coinsdd1 = Math.floor(Math.random() * 801) + 200; //random coins khi đào đá

//random things to do
var rdcn = ['hiring staff', 'hotel administrator', 'at the power plant', 'restaurant chef', 'worker']; //random job when working in industrial park
var work1 = rdcn[Math.floor(Math.random() * rdcn.length)];   

var rddv = ['plumber', 'neighbors air conditioner repair', 'multi-level sale', 'flyer distribution', 'shipper', 'computer repair', 'tour guide', 'breastfeeding' ]; //random work when working in the service area
var work2 = rddv[Math.floor(Math.random() * rddv.length)]; 

var rdmd = ['earn 13 barrels of oil', 'earn 8 barrels of oil', 'earn 9 barrels of oil', 'earn 8 barrels of oil', 'steal the oil', 'take water and pour it into oil and sell it']; //random job while working at an oil field
var work3 = rdmd[Math.floor(Math.random() * rdmd.length)]; 

var rdq = ['iron ore', 'gold ore', 'coal ore', 'lead ore', 'copper ore', 'oil ore']; //random job when mining ore
var work4 = rdq[Math.floor(Math.random() * rdq.length)]; 

var rddd = ['diamond', 'gold', 'coal', 'emerald', 'iron', 'ordinary stone', 'lazy', 'bluestone']; //random job when digging rock
var work5 = rddd[Math.floor(Math.random() * rddd.length)]; 

var rddd1 = ['vip guest', 'patent', 'stranger', '23-year-old fool', 'stranger', 'patron', '92-year-old tycoon', '12-year-old boyi']; //random work when digging rock
var work6 = rddd1[Math.floor(Math.random() * rddd1.length)];


var msg = "";
    switch(handleReply.type) {
        case "choosee": {
            
            switch(event.body) {
                case "1": msg = `⚡️أنت تعمل ${work1} في المنطقة الصناعية وكسب ${coinscn}$` ; Currencies.increaseMoney(event.senderID, coinscn); break;             
                case "2": msg = `⚡️أنت تعمل ${work2} تبيع زلابية و الشاربات فبوفاريك و كسبت ${coinsdv}$`; Currencies.increaseMoney(event.senderID, coinsdv); break;
                case "3": msg = `⚡️انت تعمل ${work3} في النفط المفتوح وبيع ${coinsmd}$`; Currencies.increaseMoney(event.senderID, coinsmd); break;
                case "4": msg = `⚡️انت تعمل${work4} في منجم وحصلت على ${coinsq}$`; Currencies.increaseMoney(event.senderID, coinsq); break;
                case "5": msg = `⚡️انت تحفر ${work5} وحصلت على ${coinsdd}$` ; Currencies.increaseMoney(event.senderID, coinsdd); break;
                case "6": msg = `⚡️اخترت ${work6} وحصلت على ${coinsdd1}$ :)))`; Currencies.increaseMoney(event.senderID, coinsdd1); break;
                case "7": msg = "⚡️ Coming soon..."; break; //add case if you want 
                default: break;
            };
            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("⚡️اخترت رقم اشتراك واحد", event.threadID, event.messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("⚡️الخيار غير موجود هيهي.", event.threadID, event.messageID); //thay số case vào số 7
            api.unsendMessage(handleReply.messageID);
            if (msg == "⚡️...") {
                msg = "⚡️تحديث قادم...";
            };
            return api.sendMessage(`${msg}`, threadID, async () => {
            data.work2Time = Date.now();
            await Currencies.setData(senderID, { data });
            
        });

    };
}
}
module.exports.run = async ({  event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    //cooldownTime for each receipt 
    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {

        var time = cooldown - (Date.now() - data.work2Time),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0); 
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), event.threadID, event.messageID);
    }
    else {    
    return api.sendMessage("Coin Earn Job Center" +
  /*công nghiệp*/ "\n\n1. work1" +
  /*dịch vụ*/  "\n2. work2." +
  /*Mỏ dầu*/ "\n3. work3." +
  /*Quặng*/ "\n4. work4" +
  /*Đào đá*/ "\n5. work5" +
  /*cave*/    "\n6. work6" +
                "\n7. Update soon..." +
                "\n\nقم بالرد على هذه الرسالة و اختر رقم" //add case display here ||  \n[number]. [Career]" +
            , event.threadID, (error, info) => {
                data.work2Time = Date.now();
        global.client.handleReply.push({
            type: "choosee",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
          })  
        })
    }
}
/*
@credit P-SeverTeam
@Vui lòng không đổi credit!
*/
