const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, getContentType, fetchLatestBaileysVersion, Browsers, } = require("@whiskeysockets/baileys");

const l = console.log; const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, } = require("./lib/functions"); const fs = require("fs"); const P = require("pino"); const config = require("./config"); const qrcode = require("qrcode-terminal"); const util = require("util"); const { sms, downloadMediaMessage } = require("./lib/msg"); const axios = require("axios"); const { File } = require("megajs"); const prefix = config.PREFIX; const { default: fetch } = import('node-fetch'); const ownerNumber = config.OWNER_NUM;

const express = require("express"); const app = express(); const port = process.env.PORT || 8000;

async function connectToWA() { console.log("Connecting VORTEX MD"); const { state, saveCreds } = await useMultiFileAuthState( __dirname + "/auth_info_baileys/" ); var { version } = await fetchLatestBaileysVersion();

const robin = makeWASocket({ logger: P({ level: "silent" }), printQRInTerminal: false, browser: Browsers.macOS("Firefox"), syncFullHistory: true, auth: state, version, });

robin.ev.on("connection.update", (update) => { const { connection, lastDisconnect } = update; if (connection === "close") { if ( lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut ) { connectToWA(); } } else if (connection === "open") { console.log("VORTEX MD connected to WhatsApp ✅"); } }); robin.ev.on("creds.update", saveCreds); robin.ev.on("messages.upsert", async (mek) => { mek = mek.messages[0]; if (!mek.message) return; mek.message = getContentType(mek.message) === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;

if (
  mek.key && 
  mek.key.remoteJid === "status@broadcast" && 
  config.AUTO_READ_STATUS === "true"
) {
  await robin.sendReadReceipt(mek.key.remoteJid, mek.key.participant, [mek.key.id]);
}

const m = sms(robin, mek);
const type = getContentType(mek.message);
const body =
  type === "conversation"
    ? mek.message.conversation
    : type === "extendedTextMessage"
    ? mek.message.extendedTextMessage.text
    : "";
const isCmd = body.startsWith(prefix);
const command = isCmd
  ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
  : "";
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const from = mek.key.remoteJid;
const sender = mek.key.fromMe
  ? robin.user.id.split(":"[0]) + "@s.whatsapp.net"
  : mek.key.participant || mek.key.remoteJid;
const senderNumber = sender.split("@")[0];
const isOwner = ownerNumber.includes(senderNumber);
const reply = (teks) => {
  robin.sendMessage(from, { text: teks }, { quoted: mek });
};

if (isCmd) {
  const events = require("./command");
  const cmd =
    events.commands.find((cmd) => cmd.pattern === command) ||
    events.commands.find((cmd) => cmd.alias && cmd.alias.includes(command));
  if (cmd) {
    try {
      cmd.function(robin, mek, m, {
        from,
        body,
        isCmd,
        command,
        args,
        q,
        sender,
        senderNumber,
        isOwner,
        reply,
      });
    } catch (e) {
      console.error("[PLUGIN ERROR] " + e);
    }
  }
}

}); }

app.get("/", (req, res) => { res.send("Hey, VORTEX-MD started ✅"); }); app.listen(port, () => console.log(Server listening on port http://localhost:${port}) ); setTimeout(() => { connectToWA(); }, 4000);

