const { cmd, commands } = require("../command");
const config = require("../config");

// .menu command – Display Main Menu and start session
cmd(
  {
    pattern: "menu",
    alias: ["getmenu"],
    react: "📔",
    desc: "Get command list",
    category: "main",
    filename: __filename,
  },
  async (conn, mek, m, { from, pushname, reply }) => {
    try {
      let mainMenu = `👋 *Hello ${pushname}*

╔════════════════╗  
  🍁 *VORTEX MD MENU* 🍁  
╚════════════════╝  

1️⃣ Main Commands  
2️⃣ Download Commands  
3️⃣ Group Commands  
4️⃣ Owner Commands  
5️⃣ Convert Commands  
6️⃣ Search Commands  

📝 Reply with a number (1-6) to view the respective command list.
🔄 Reply *0* to return to the Main Menu.`;

      await reply(mainMenu);
      global.menuSessions = global.menuSessions || {};
      global.menuSessions[from] = true; // Activate menu session for this sender
    } catch (e) {
      console.error(e);
      await reply(`❌ Error: ${e}`);
    }
  }
);

// Global reply listener for menu navigation – Captures user replies with numbers 0-6
cmd(
  {
    pattern: ".*", // Match all messages
    dontAddCommandList: true,
  },
  async (conn, mek, m, { from, body, reply }) => {
    if (!global.menuSessions || !global.menuSessions[from]) return; // No active menu session; ignore
    let userInput = body.trim();
    let menuResponse = "";
    switch (userInput) {
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
        menuResponse = `🔄 *MAIN MENU*  

1️⃣ Main Commands  
2️⃣ Download Commands  
3️⃣ Group Commands  
4️⃣ Owner Commands  
5️⃣ Convert Commands  
6️⃣ Search Commands  

📝 Reply with a number (1-6) to view the respective command list.
🔄 Reply *0* to return to this menu.`;
        break;
      default:
        menuResponse = "❌ Invalid option! Please reply with a number (1-6) or *0* to return to the Main Menu.";
    }
    await reply(menuResponse);
  }
);
