const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
  config: {
    name: "موسيقى",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "يونو",
    description: "تحميل أغاني من يوتيوب عن طريق البحث بالكلمة أو الرابط",
    commandCategory: "وسائط",
    usages: "[اسم_الأغنية] [نوع]",
    cooldowns: 5,
    dependencies: {
      "node-fetch": "",
      "yt-search": "",
    },
  },

  run: async function ({ api, event, args }) {
    let اسم_الأغنية, النوع;

    // إذا كان آخر كلمة "audio" أو "video" يعتبر نوع الملف، وإلا الافتراضي "audio"
    if (
      args.length > 1 &&
      (args[args.length - 1] === "audio" || args[args.length - 1] === "video")
    ) {
      النوع = args.pop();
      اسم_الأغنية = args.join(" ");
    } else {
      اسم_الأغنية = args.join(" ");
      النوع = "audio";
    }

    // إرسال رسالة مؤقتة تفيد بدء المعالجة
    const رسالة_جاري_المعالجة = await api.sendMessage(
      "✅ جاري معالجة طلبك، يرجى الانتظار...",
      event.threadID,
      null,
      event.messageID
    );

    try {
      // البحث في يوتيوب عن اسم الأغنية
      const نتائج_البحث = await ytSearch(اسم_الأغنية);
      if (!نتائج_البحث || !نتائج_البحث.videos.length) {
        throw new Error("لم يتم العثور على نتائج لبحثك.");
      }

      // أخذ أول نتيجة من نتائج البحث
      const أول_نتيجة = نتائج_البحث.videos[0];
      const معرف_الفيديو = أول_نتيجة.videoId;

      // رابط API خارجي لتحميل الصوت أو الفيديو (تحتاج مفتاح API صحيح)
      const apiKey = "priyansh-here";
      const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${معرف_الفيديو}&type=${النوع}&apikey=${apiKey}`;

      // رد فعل مؤقت على رسالة المستخدم
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      // طلب رابط التحميل من API الخارجي
      const استجابة_التحميل = await axios.get(apiUrl);
      const رابط_التحميل = استجابة_التحميل.data.downloadUrl;

      // تجهيز اسم ملف آمن (بدون رموز خاصة)
      const اسم_آمن = أول_نتيجة.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const اسم_الملف = `${اسم_آمن}.${النوع === "audio" ? "mp3" : "mp4"}`;
      const مسار_التحميل = path.join(__dirname, "cache", اسم_الملف);

      // إنشاء مجلد التخزين إذا لم يكن موجوداً
      if (!fs.existsSync(path.dirname(مسار_التحميل))) {
        fs.mkdirSync(path.dirname(مسار_التحميل), { recursive: true });
      }

      // تنزيل الملف كتيار بيانات وحفظه على القرص
      const رد_التحميل = await axios({
        url: رابط_التحميل,
        method: "GET",
        responseType: "stream",
      });

      const تيار_الملف = fs.createWriteStream(مسار_التحميل);
      رد_التحميل.data.pipe(تيار_الملف);

      // انتظار انتهاء الكتابة
      await new Promise((resolve, reject) => {
        تيار_الملف.on("finish", resolve);
        تيار_الملف.on("error", reject);
      });

      // تغيير رد الفعل إلى إشارة النجاح
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // إرسال الملف للمستخدم مع رسالة تحتوي على عنوان الأغنية ونوع الملف
      await api.sendMessage(
        {
          attachment: fs.createReadStream(مسار_التحميل),
          body: `🖤 العنوان: ${أول_نتيجة.title}\n\nإليك ${النوع === "audio" ? "الصوت" : "الفيديو"} الخاص بك 🎧:`,
        },
        event.threadID,
        () => {
          // حذف الملف المؤقت بعد الإرسال
          fs.unlinkSync(مسار_التحميل);
          // حذف رسالة المعالجة المؤقتة
          api.unsendMessage(رسالة_جاري_المعالجة.messageID);
        },
        event.messageID
      );
    } catch (error) {
      console.error(`فشل في تحميل وإرسال الأغنية: ${error.message}`);
      api.sendMessage(
        `حدث خطأ أثناء تحميل الأغنية: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  },
};