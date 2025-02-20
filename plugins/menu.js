


const { cmd } = require("../command");

cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    react: "📔",
    desc: "get cmd list",
    category: "main",
    filename: __filename,
  },
  async (robin, mek, m, { from, pushname, reply }) => {
    try {
      let mainMenu = `👋 *Hello ${pushname}*

╔════════════════╗  
  🍁 *VORTEX MD* 🍁  
╚════════════════╝

1️⃣ Main Commands  
2️⃣ Download Commands  
3️⃣ Group Commands  
4️⃣ Owner Commands  
5️⃣ Convert Commands  
6️⃣ AI Commands  

📝 Reply with a number (1-6) to get the respective command list.
🔄 Reply *0* to return to this menu.`;

      let sentMsg = await robin.sendMessage(from, { text: mainMenu }, { quoted: mek });

      // Reply listener for pagination
      robin.onReply(sentMsg.id, async (replyMessage) => {
        let userInput = replyMessage.text.trim();

        let menuResponse = "";
        switch (userInput) {
          case "1":
            menuResponse = `🎯 *MAIN COMMANDS*  
  👉 .alive  
  👉 .menu  
  👉 .system  
  👉 .owner  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "2":
            menuResponse = `📥 *DOWNLOAD COMMANDS*  
  👉 .song <text>  
  👉 .video <text>  
  👉 .fb <link>  
  👉 .rtiktok  
  👉 .sinhala <text>  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "3":
            menuResponse = `👥 *GROUP COMMANDS*  
  👉 .Mute  
  👉 .ban  
  👉 .tagall  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "4":
            menuResponse = `🔒 *OWNER COMMANDS*  
  👉 .restart  
  👉 .update  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "5":
            menuResponse = `✏️ *CONVERT COMMANDS*  
  👉 .sticker <reply img>  
  👉 .img <reply sticker>  
  👉 .tr <lang> <text>  
  👉 .tts <text>  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "6":
            menuResponse = `💤 *AI COMMANDS*  
  👉 .ai <text>  
  👉 .gpt <text>  
  👉 .gen <text>  
🔄 Reply *0* to return to Main Menu.`;
            break;
          case "0":
            menuResponse = mainMenu;
            break;
          default:
            menuResponse = "❌ Invalid option! Please reply with a number (1-6) or *0* to return.";
        }

        await robin.sendMessage(from, { text: menuResponse }, { quoted: replyMessage });
      });

    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
