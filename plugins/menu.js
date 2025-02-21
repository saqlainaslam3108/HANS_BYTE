const { cmd } = require("../command");

global.menuSessions = global.menuSessions || {}; // Active sessions tracker

// Utility: Send main menu text
async function sendMainMenu(reply, pushname) {
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

📝 Reply with a number (1-6) to get the respective command list.
🔄 Reply *0* to return to this menu.`;
  await reply(mainMenu);
}

// Timeout for session clearance (e.g. 5 minutes)
function startSessionTimeout(from) {
  // Clear any existing timeout for the user
  if (global.menuSessions[from] && global.menuSessions[from].timeout) {
    clearTimeout(global.menuSessions[from].timeout);
  }
  // Set new timeout
  const timeout = setTimeout(() => {
    console.log(`⌛ Session timeout for ${from}`);
    delete global.menuSessions[from];
  }, 5 * 60 * 1000); // 5 minutes

  // Save timeout object in session
  global.menuSessions[from].timeout = timeout;
}

// .menu command – Display main menu and start session
cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    react: "📔",
    desc: "Get command list",
    category: "main",
    filename: __filename,
  },
  async (robin, mek, m, { from, pushname, reply }) => {
    try {
      console.log(`✅ .menu command triggered from: ${from}`);
      // Initialize or update session for this user
      global.menuSessions[from] = { active: true };
      startSessionTimeout(from);
      await sendMainMenu(reply, pushname);
    } catch (e) {
      console.log(`❌ ERROR in .menu command: ${e}`);
      reply(`❌ Error: ${e}`);
    }
  }
);

// Global reply listener for menu navigation
cmd(
  {
    pattern: ".*",
    dontAddCommandList: true,
  },
  async (robin, mek, m, { from, body, pushname, reply }) => {
    // Check if this user has an active menu session
    if (!global.menuSessions[from]) return; // No active session, ignore
    let userInput = body.trim();
    console.log(`📥 Received input '${userInput}' from: ${from}`);

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
        // Re-display the main menu without ending the session
        menuResponse = `🔄 Returning to Main Menu...`;
        // Send main menu after response
        await reply(menuResponse);
        // Restart session timeout
        startSessionTimeout(from);
        return sendMainMenu(reply, pushname);
      default:
        menuResponse = "❌ Invalid option! Please reply with a number (1-6) or *0* to return.";
    }
    // Restart session timeout after processing a valid input
    startSessionTimeout(from);
    await reply(menuResponse);
  }
);
