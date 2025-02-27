const { cmd, commands } = require("../command");
const config = require('../config');

cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    react: "📔",
    desc: "get cmd list",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      let menu = {
        main: "",
        download: "",
        group: "",
        owner: "",
        convert: "",
        search: "",
      };

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[
            commands[i].category
          ] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

      let madeMenu = `👋 *Hello  ${pushname}*
╔════════════════╗  
     🍁 *VORTEX MD* 🍁  
╚════════════════╝  
📜 MAIN COMMANDS
🔹 .alive
🔹 .menu
🔹 .ai <text>
🔹 .system
🔹 .owner

📥 DOWNLOAD COMMANDS
🔹 .song <text>
🔹 .video <text>
🔹 .fb <link>
🔹 .upload <animepahe link>
🔹 .sinhala <text>
🔹 .dl <d.link>

👥 GROUP COMMANDS
🔹 .mute
🔹 .kick

🔒 OWNER COMMANDS
🔹 .restart

✏️ CONVERT COMMANDS
🔹 .sticker <reply img>
🔹 .img <reply sticker>
🔹 .tr <lang> <text>
🔹 .tts <text>
🔹 .gen <text>
🔹 .gen2 <text>

🔍 SEARCH COMMANDS
🔹 .anime <text>
🔹 .hirunews
🔹 .weather <text>
🔹 .img <text>

╔══════════⚔️═══════════╗  
          *Made by Pansilu Nethmina*
          > ᐯㄖ尺ㄒ乇乂 几ᗪ 爪乇几卄
╚══════════⚔️═══════════╝

`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/tumblr_1d7104aa11efcf7ebbaab88a184a7279_25602a04_1280%7E2.jpg",
          },
          caption: madeMenu,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
