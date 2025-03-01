const { cmd, commands } = require("../command");
const config = require('../config');

cmd(
  {
    pattern: "menu",
    alias: ["getmenu"],
    react: "📔",
    desc: "Get cmd list",
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

      // This is the initial greeting message
      let menuOptions = `
🤩 *Hello* ${pushname}☠️
> 🌀 *WELCOME TO VORTEX MD* 🌀

╭──────────────────━┈⊷
│◦ ✗🤖BOT NAME : *VORTEX MD*
│◦ ✗👤OWNER NAME : *Pansilu Nethmina*
│◦ ✗☎️OWNER NUMBER : *${senderNumber}*
│◦ ✗⏰UPTIME : 1 minute, 49 seconds
│◦ ✗💾RAM : 90.16MB / 63276MB
│◦ ✗💫PREFIX : .
╰──────────────────━┈⊷

*🔢 REPLY WITH THE NUMBER BELOW TO GET THE MENU*

1 │❯❯◦ OWNER MENU
2 │❯❯◦ MOVIE MENU
3 │❯❯◦ AI MENU
4 │❯❯◦ SEARCH MENU
5 │❯❯◦ DOWNLOAD MENU
6 │❯❯◦ MAIN MENU
7 │❯❯◦ CONVERT MENU
8 │❯❯◦ OTHER MENU
9 │❯❯◦ LOGO MENU
10 │❯❯◦ FUN MENU
11 │❯❯◦ GROUP MENU

> *Gitlab Repo* https://gitlab.com/anukunu2000/asitha-md-v3/-/tree/master

*Powered by Pansilu Nethmina*`;

      if (body.match(/1/)) {
        reply(`*OWNER MENU*\n🔹 .restart\n🔹 .left\n🔹 .block`);
      } else if (body.match(/2/)) {
        reply(`*MOVIE MENU*\n🔹 .anime <text>\n🔹 .movie <text>`);
      } else if (body.match(/3/)) {
        reply(`*AI MENU*\n🔹 .ai <text>\n🔹 .ask <question>`);
      } else if (body.match(/4/)) {
        reply(`*SEARCH MENU*\n🔹 .anime <text>\n🔹 .weather <location>`);
      } else if (body.match(/5/)) {
        reply(`*DOWNLOAD MENU*\n🔹 .song <text>\n🔹 .video <text>\n🔹 .fb <link>`);
      } else if (body.match(/6/)) {
        reply(`*MAIN MENU*\n🔹 .alive\n🔹 .menu\n🔹 .system\n🔹 .owner`);
      } else if (body.match(/7/)) {
        reply(`*CONVERT MENU*\n🔹 .sticker <reply img>\n🔹 .toimg <reply sticker>`);
      } else if (body.match(/8/)) {
        reply(`*OTHER MENU*\n🔹 .help\n🔹 .info`);
      } else if (body.match(/9/)) {
        reply(`*LOGO MENU*\n🔹 .logo <text>\n🔹 .genlogo <text>`);
      } else if (body.match(/10/)) {
        reply(`*FUN MENU*\n🔹 .joke\n🔹 .meme`);
      } else if (body.match(/11/)) {
        reply(`*GROUP MENU*\n🔹 .mute\n🔹 .kick\n🔹 .promote`);
      } else {
        await robin.sendMessage(
          from,
          {
            image: {
              url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/tumblr_1d7104aa11efcf7ebbaab88a184a7279_25602a04_1280%7E2.jpg",
            },
            caption: menuOptions,
          },
          { quoted: mek }
        );
      }
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
