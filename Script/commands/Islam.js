/** I am doing this coding with a lot of difficulty, please don't post it yourself¯\_(ツ)_/¯ **/
module.exports.config = {
  name: "سورة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Islamick Chat",
  description: "prefix VEDIO",
  commandCategory: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  usages: "love10 vedio",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
   var hi = ["•┄┅════❁🌺❁════┅┄•\n\nالسلام عليكم-!!🖤💫أحبتي الإخوة والأخوات  \n\n•┄┅════❁🌺❁════┅┄•\n

  "];
  var know = hi[Math.floor(Math.random() * hi.length)];
  var link = [
"https://drive.google.com/file/d/17gSCru-FcVNYNSLOruLB0f61EWDBI2pB/view?usp=drivesdk",
"https://drive.google.com/file/d/17lDryBD_IC5XGfSrUxBmUi_txztOdMp4/view?usp=drivesdk",
"https://drive.google.com/file/d/17g1Sz1m34h39ZutGm7eXsFTrfX0jG4YZ/view?usp=drivesdk",
"https://drive.google.com/file/d/17nOxEX5Pq6x4iYl0htmPL9rV3Rdj-EMt/view?usp=drivesdk",
"https://drive.google.com/uc?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4",
"https://drive.google.com/uc?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprD",
"https://drive.google.com/uc?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA",
"https://drive.google.com/uc?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441",
"https://drive.google.com/uc?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8",
"https://drive.google.com/uc?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo",

];
     var callback = () => api.sendMessage({body:` ${know} `,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4"));    
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
   };
 
