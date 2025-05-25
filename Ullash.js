const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");

// ==========================================
//   إنشاء خادم Express لتفعيل الرابط
// ==========================================
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("البوت Yuna يعمل الآن – كل شيء تمام!");
});

app.listen(port, () => {
  logger(`✅ Web server is running on port ${port}`, "[ Yuna Server ]");
}).on("error", (err) => {
  if (err.code === "EACCES") {
    logger(`Permission denied. Cannot bind to port ${port}.`, "[ Error ]");
  } else {
    logger(`Server error: ${err.message}`, "[ Error ]");
  }
});

// ==========================================
//   تشغيل البوت Cyber.js تلقائيًا
// ==========================================
global.countRestart = global.countRestart || 0;

function startBot(message) {
  if (message) logger(message, "[ Yuna Boot ]");

  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Cyber.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (codeExit) => {
    if (codeExit !== 0 && global.countRestart < 5) {
      global.countRestart += 1;
      logger(`Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ Restarting ]");
      startBot();
    } else {
      logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
    }
  });

  child.on("error", (error) => {
    logger(`An error occurred: ${JSON.stringify(error)}`, "[ Error ]");
  });
}

// ==========================================
//   فحص تحديث من GitHub (اختياري)
// ==========================================
axios.get("https://raw.githubusercontent.com/cyber-ullash/cyber-bot/main/data.json")
  .then((res) => {
    logger(res.data.name, "[ NAME ]");
    logger(`Version: ${res.data.version}`, "[ VERSION ]");
    logger(res.data.description, "[ DESCRIPTION ]");
  })
  .catch((err) => {
    logger(`Failed to fetch update info: ${err.message}`, "[ Update Error ]");
  });

// ==========================================
//   تشغيل البوت
// ==========================================
startBot();

// ==========================================
//   Keep Alive Ping كل دقيقة
// ==========================================
setInterval(() => {
  axios.get("https://e7935e24-029f-4490-b615-3d10807f1f1c-00-3etl4bi06z9gk.kirk.replit.dev").catch(() => {});
}, 60 * 1000);
