const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const P = require("pino");
const axios = require("axios");
const { File } = require("megajs");
const express = require("express");
const config = require("./config");
const qrcode = require("qrcode-terminal");
const { sms } = require("./lib/msg");
const { getBuffer, getGroupAdmins } = require("./lib/functions");
const events = require("./command");
const app = express();
const port = process.env.PORT || 8000;
const prefix = config.PREFIX;
const ownerNumber = config.OWNER_NUM;

// ================= SESSION AUTH ====================
if (!fs.existsSync("./auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID)
    return console.log("❌ Please add your session to SESSION_ID env!");
  const filer = File.fromURL(`https://mega.nz/file/${config.SESSION_ID}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile("./auth_info_baileys/creds.json", data, () => {
      console.log("✅ Session downloaded!");
    });
  });
}

// ============== WHATSAPP CONNECTION ================
async function connectToWA() {
  console.log("🔹 Connecting VORTEX MD...");
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys/");
  const { version } = await fetchLatestBaileysVersion();

  const robin = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    auth: state,
    version,
  });

  robin.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === "open") {
      console.log("✅ VORTEX MD connected successfully!");
      robin.sendMessage(ownerNumber + "@s.whatsapp.net", { text: "Bot connected! ✅" });
    }
  });
  robin.ev.on("creds.update", saveCreds);

  robin.ev.on("messages.upsert", async (mek) => {
    if (!mek.messages[0]?.message) return;
    const m = sms(robin, mek.messages[0]);
    const body = m.body || "";
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).split(" ").shift().toLowerCase() : "";
    const args = body.split(" ").slice(1);
    const from = mek.messages[0].key.remoteJid;
    const sender = mek.messages[0].key.participant || from;
    const isGroup = from.endsWith("@g.us");
    const groupMetadata = isGroup ? await robin.groupMetadata(from).catch(() => {}) : {};
    const groupAdmins = isGroup ? await getGroupAdmins(groupMetadata.participants || []) : [];
    const isBotAdmin = isGroup ? groupAdmins.includes(robin.user.id) : false;
    const isAdmin = isGroup ? groupAdmins.includes(sender) : false;

    if (isCmd) {
      const cmd = events.commands.find((c) => c.pattern === command);
      if (cmd) {
        try {
          cmd.function(robin, m, { from, args, isGroup, sender, isBotAdmin, isAdmin });
        } catch (e) {
          console.error("[❌ Command Error]", e);
        }
      }
    }
  });
}

// ============== EXPRESS SERVER ================
app.get("/", (req, res) => {
  res.send("✅ VORTEX MD is running!");
});
app.listen(port, () => console.log(`🌍 Server running at http://localhost:${port}`));

setTimeout(connectToWA, 4000);


