const { readEnv } = require("../lib/database");
const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
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
      const config = await readEnv();
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


| 📔*MAIN COMMANDS*📔 |
    ❤️.alive
    ❤️.menu
    ❤️.ai <text>
    ❤️.system
    ❤️.owner
| 📥*DOWNLOAD COMMANDS*📥 |
    ❤️.song <text>
    ❤️.video <text>
    ❤️.fb <link>
| *GROUP COMMANDS* |
${menu.group}
| 🔒*OWNER COMMANDS*🔒 |
    ❤️.restart
    ❤️.update
| ✏️*CONVERT COMMANDS*✏️ |
    ❤️.sticker <reply img>
    ❤️.img <reply sticker>
    ❤️.tr <lang><text>
    ❤️.tts <text>
| 🔦*SEARCH COMMANDS*🔦 |
${menu.search}


🍂 𝐌𝐚𝐝𝐞 𝐛𝐲 𝗣𝗮𝗻𝘀𝗶𝗹𝘂 𝗡𝗲𝘁𝗵𝗺𝗶𝗻𝗮 🍂

> ᐯㄖ尺ㄒ乇乂 几ᗪ 爪乇几卄
`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(9)%20(1)%7E2%20(1).jpeg",
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
