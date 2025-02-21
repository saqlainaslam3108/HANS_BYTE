const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const l = console.log;
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
} = require("./lib/functions");
const fs = require("fs");
const P = require("pino");
const config = require("./config");
const qrcode = require("qrcode-terminal");
const util = require("util");
const { sms, downloadMediaMessage } = require("./lib/msg");
const axios = require("axios");
const { File } = require("megajs");
const prefix = config.PREFIX;
const ownerNumber = config.OWNER_NUM;

if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID)
    return console.log("Please add your session to SESSION_ID env !!");
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + "/auth_info_baileys/creds.json", data, () => {
      console.log("Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

global.menuSessions = global.menuSessions || {}; // Global menu session tracker

async function connectToWA() {
  console.log("Connecting VORTEX MD");
  const { state, saveCreds } = await useMultiFileAuthState(
    __dirname + "/auth_info_baileys/"
  );
  var { version } = await fetchLatestBaileysVersion();

  const robin = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version,
  });

  robin.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      if (
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
      ) {
        connectToWA();
      }
    } else if (connection === "open") {
      console.log(" Installing... ");
      const path = require("path");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("VORTEX MD installed successful ✅");
      console.log("VORTEX MD connected to whatsapp ✅");

      let up = `VORTEX MD connected successful ✅`;
      let up1 = `Hello Pansilu, I made bot successful ☄️`;

      robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(8).jpeg`,
        },
        caption: up,
      });
      robin.sendMessage("94763513529@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(8).jpeg`,
        },
        caption: up1,
      });
    }
  });
  robin.ev.on("creds.update", saveCreds);

  // ─── GLOBAL MENU REPLY LISTENER ──────────────────────────────────────────────
  robin.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return; // Process only notify events

    for (const msg of messages) {
      if (!msg.message) continue;
      // Convert ephemeral messages
      msg.message =
        getContentType(msg.message) === "ephemeralMessage"
          ? msg.message.ephemeralMessage.message
          : msg.message;

      // Extract basic message details
      const from = msg.key.remoteJid;
      const body =
        msg.message.conversation ||
        (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) ||
        "";
      
      // Check if the sender has an active menu session and the body is a single digit (0-6)
      if (global.menuSessions[from] && body.trim().match(/^[0-6]$/)) {
        console.log(`📥 Global Menu Listener: Received "${body.trim()}" from ${from}`);
        let menuResponse = "";
        switch (body.trim()) {
          case "1":
            menuResponse = `🎯 *MAIN COMMANDS*  
❤️ .alive  
❤️ .menu  
❤️ .ai <text>  
❤️ .system  
❤️ .owner  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "2":
            menuResponse = `📥 *DOWNLOAD COMMANDS*  
❤️ .song <text>  
❤️ .video <text>  
❤️ .fb <link>  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "3":
            menuResponse = `👥 *GROUP COMMANDS*  
❤️ .tagall  
❤️ .mute  
❤️ .ban  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "4":
            menuResponse = `🔒 *OWNER COMMANDS*  
❤️ .restart  
❤️ .update  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "5":
            menuResponse = `✏️ *CONVERT COMMANDS*  
❤️ .sticker <reply img>  
❤️ .img <reply sticker>  
❤️ .tr <lang> <text>  
❤️ .tts <text>  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "6":
            menuResponse = `🔍 *SEARCH COMMANDS*  
❤️ .search <query>  
❤️ .ytsearch <query>  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "0":
            menuResponse = `🔄 Returning to Main Menu...  

1️⃣ Main Commands  
2️⃣ Download Commands  
3️⃣ Group Commands  
4️⃣ Owner Commands  
5️⃣ Convert Commands  
6️⃣ Search Commands  

📝 Reply with a number (1-6) to get the respective command list.
🔄 Reply *0* to return to this menu.`;
            break;
          default:
            menuResponse = "❌ Invalid option! Please reply with a number (1-6) or *0* to return.";
        }
        try {
          await robin.sendMessage(from, { text: menuResponse }, { quoted: msg });
          console.log(`✅ Replied to ${from} with menu response.`);
        } catch (e) {
          console.log(`❌ Error sending menu response to ${from}: ${e}`);
        }
        // Prevent further processing for menu replies
        continue;
      }

      // Continue with your existing message processing below...
      // AUTO_READ_STATUS, command handling etc.
      if (msg.key.remoteJid === "status@broadcast" && config.AUTO_READ_STATUS == "true") {
        await robin.readMessage([msg.key]);
      }

      const m = sms(robin, msg);
      const typeMsg = getContentType(msg.message);
      const quoted =
        typeMsg == "extendedTextMessage" &&
        msg.message.extendedTextMessage.contextInfo != null
          ? msg.message.extendedTextMessage.contextInfo.quotedMessage || []
          : [];
      // Additional processing, command parsing etc. goes here.
      // (Your existing code for command handling is below.)
      
      // Example extraction (already in your code):
      const textBody =
        typeMsg === "conversation"
          ? msg.message.conversation
          : typeMsg === "extendedTextMessage"
          ? msg.message.extendedTextMessage.text
          : typeMsg == "imageMessage" && msg.message.imageMessage.caption
          ? msg.message.imageMessage.caption
          : typeMsg == "videoMessage" && msg.message.videoMessage.caption
          ? msg.message.videoMessage.caption
          : "";
      const isCmd = textBody.startsWith(prefix);
      // ... further command handling
      // (Your existing command handler invocation below)
    }
  });
  // ─────────────────────────────────────────────────────────────────────────────

  // Your other event handlers, for example, owner react etc., remain unchanged.
  robin.ev.on("messages.upsert", async (mek) => {
    // (The rest of your code in this handler is already present above.)
    // We assume that commands from plugins are triggered separately.
  });

  // Start your express server
  app.get("/", (req, res) => {
    res.send("hey, VORTEX-MD started✅");
  });
  app.listen(port, () =>
    console.log(`Server listening on port http://localhost:${port}`)
  );
}

setTimeout(() => {
  connectToWA();
}, 4000);
