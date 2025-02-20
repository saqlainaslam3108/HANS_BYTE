const { cmd } = require("../command");

let menuSessions = {}; // User sessions store (to track replies)

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

      await robin.sendMessage(from, { text: mainMenu }, { quoted: mek });

      // Store user session
      menuSessions[from] = true;

    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);

// Listen for all messages (to check for replies)
cmd(
  {
    pattern: ".*", // Match all messages
    dontAddCommandList: true, // Hide from command list
  },
  async (robin, mek, m, { from, reply }) => {
    if (!menuSessions[from]) return; // If user didn't open menu, ignore

    let userInput = m.body.trim();

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
        menuResponse = `🔄 Returning to Main Menu...  
        
1️⃣ Main Commands  
2️⃣ Download Commands  
3️⃣ Group Commands  
4️⃣ Owner Commands  
5️⃣ Convert Commands  
6️⃣ AI Commands  

📝 Reply with a number (1-6) to get the respective command list.
🔄 Reply *0* to return to this menu.`;
        break;
      default:
        menuResponse = "❌ Invalid option! Please reply with a number (1-6) or *0* to return.";
    }

    await robin.sendMessage(from, { text: menuResponse }, { quoted: mek });

    // If user enters 0, clear session
    if (userInput === "0") delete menuSessions[from];
  }
);
