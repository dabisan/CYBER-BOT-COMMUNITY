const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "كوبل",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "يونو",
    description: "كوبل بين شخصين بصورة رومانسية",
    commandCategory: "Love",
    usages: "[tag]",
    cooldowns: 5
};

module.exports.onLoad = async () => {
    const dirMaterial = path.join(__dirname, "cache", "canvas");
    const imagePath = path.join(dirMaterial, "seophi.png");
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(imagePath)) {
        const res = await axios.get("https://i.imgur.com/hmKmmam.jpg", { responseType: "arraybuffer" });
        fs.writeFileSync(imagePath, res.data);
    }
};

async function circle(imagePath) {
    const image = await jimp.read(imagePath);
    image.circle();
    return image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const bgPath = path.join(__root, "seophi.png");
    const pathImg = path.join(__root, `couple_${one}_${two}.png`);
    const avatarOnePath = path.join(__root, `avt_${one}.png`);
    const avatarTwoPath = path.join(__root, `avt_${two}.png`);

    const avatarOneData = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOnePath, avatarOneData);

    const avatarTwoData = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwoPath, avatarTwoData);

    const background = await jimp.read(bgPath);
    const circleOne = await jimp.read(await circle(avatarOnePath));
    const circleTwo = await jimp.read(await circle(avatarTwoPath));

    background.resize(1024, 712)
        .composite(circleOne.resize(200, 200), 527, 141)
        .composite(circleTwo.resize(200, 200), 389, 407);

    const buffer = await background.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, buffer);
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return pathImg;
}

module.exports.run = async function ({ event, api, args }) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("يرجى عمل تاغ لشخص!", event.threadID, event.messageID);

    const tag = event.mentions[mention].replace("@", "");
    const one = event.senderID;
    const two = mention;

    try {
        const imagePath = await makeImage({ one, two });
        return api.sendMessage({
            body: `كوبل جميل بينك وبين ${tag}`,
            mentions: [{ tag: tag, id: mention }],
            attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
    } catch (err) {
        console.error(err);
        return api.sendMessage("حدث خطأ أثناء إنشاء الصورة.", event.threadID, event.messageID);
    }
};