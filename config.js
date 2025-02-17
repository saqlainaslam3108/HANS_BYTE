const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "m3523J4R#hFweCit7r0ggx_G2LTCvPYiRYmZSxEGL8UgGeHSIC2U",
  OWNER_NUM: process.env.OWNER_NUM || "94763513529",
  PREFIX:process.env.PREFIX || ".",
  ALIVE_IMG:process.env.ALIVE_IMG||"https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(11).jpeg",
  ALIVE_MSG:process.env.ALIVE_MSG || "Hello , I am alive now!!\n\n Join my Support group using this Link 📥 \n\n https://chat.whatsapp.com/EXPFUXpHxFR5ur03emaNx0 \n\n 💝 𝐌𝐚𝐝𝐞 𝐛𝐲 PANSILU 💝 \n\n 🔒 ᐯㄖ尺ㄒ乇乂 爪ᗪ ㄒ乇卂爪 🔒 ",
  AUTO_READ_STATUS:process.env.AUTO_READ_STATUS|| "true",
  MODE:process.env.MODE || "public",
  AUTO_VOICE:process.env.AUTO_VOICE|| "true",
  AUTO_STICKER:process.env.AUTO_STICKER|| "true",
  AUTO_REPLY:process.env.AUTO_REPLY|| "true",
  
};
