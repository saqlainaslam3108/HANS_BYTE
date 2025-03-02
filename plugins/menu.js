const { cmd, commands } = require("../command");
const config = require('../config');

cmd(
  {
    pattern: "menu",
    alias: ["getmenu"],
    react: "📔",
    desc: "Get command list",
    category: "main",
    filename: __filename,
  },
  async (robin, mek, m, { from, pushname, reply }) => {
    try {
      let menuText = `
👋 *Hello ${pushname}*  
╔════════════════╗  
       🍁 *VORTEX MD* 🍁  
╚════════════════╝  

📜 *Select a category by replying with a number:*

1️⃣ MAIN COMMANDS  
2️⃣ DOWNLOAD COMMANDS  
3️⃣ GROUP COMMANDS  
4️⃣ OWNER COMMANDS  
5️⃣ CONVERT COMMANDS  
6️⃣ SEARCH COMMANDS  

> *⚖️ Powered By - ©𝗩𝗢𝗥𝗧𝗘𝗫 𝗠𝗗 💚*
`;

      const msgMenu = await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/tumblr_1d7104aa11efcf7ebbaab88a184a7279_25602a04_1280%7E2.jpg",
          },
          caption: menuText,
        },
        { quoted: mek }
      );

      robin.ev.on("messages.upsert", async (msgUpdate) => {
        const msg = msgUpdate.messages[0];
        if (!msg.message || !msg.message.extendedTextMessage) return;

        const selectedOption = msg.message.extendedTextMessage.text.trim();

        if (
          msg.message.extendedTextMessage.contextInfo &&
          msg.message.extendedTextMessage.contextInfo.stanzaId === msgMenu.key.id
        ) {
          let responseText = "";
          switch (selectedOption) {
            case "1":
              responseText = `
📜 *MAIN COMMANDS*  
🔹 .alive  
🔹 .menu  
🔹 .ai <text>  
🔹 .system  
🔹 .owner  
              `;
              break;
            case "2":
              responseText = `
📥 *DOWNLOAD COMMANDS*  
🔹 .song <text>  
🔹 .video <text>  
🔹 .fb <link>  
🔹 .upload <animepahe link>  
🔹 .sinhala <text>  
🔹 .dl <d_link>  
🔹 .rtik <text>  
🔹 .mediafire <text>  
              `;
              break;
            case "3":
              responseText = `
👥 *GROUP COMMANDS*  
🔹 .mute  
🔹 .kick  
🔹 .unmute  
🔹 .demote  
🔹 .promote  
              `;
              break;
            case "4":
              responseText = `
🔒 *OWNER COMMANDS*  
🔹 .restart  
🔹 .left  
🔹 .block  
              `;
              break;
            case "5":
              responseText = `
✏️ *CONVERT COMMANDS*  
🔹 .sticker <reply img>  
🔹 .toimg <reply sticker>  
🔹 .gen <text>  
🔹 .gen2 <text>  
🔹 .txt2img <text>  
              `;
              break;
            case "6":
              responseText = `
🔍 *SEARCH COMMANDS*  
🔹 .anime <text>  
🔹 .hirunews  
🔹 .itnnews  
🔹 .weather <text>  
🔹 .img <text>  
              `;
              break;
            default:
              responseText = "❌ Invalid option. Please select a valid number.";
          }

          await robin.sendMessage(
            from,
            { text: responseText },
            { quoted: mek }
          );
        }
      });
    } catch (e) {
      console.log(e);
      reply("An error occurred while processing your request.");
    }
  }
);
