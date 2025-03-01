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
      // The initial menu options
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

      // Send the initial menu options
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

      // Listen for the user's reply (number)
      robin.on('message', async (msg) => {
        if (msg.from === from && msg.body.match(/^\d+$/)) {
          const replyNumber = msg.body.trim();

          if (replyNumber === '1') {
            await reply(`*OWNER MENU*\n🔹 .restart\n🔹 .left\n🔹 .block`);
          } else if (replyNumber === '2') {
            await reply(`*MOVIE MENU*\n🔹 .anime <text>\n🔹 .movie <text>`);
          } else if (replyNumber === '3') {
            await reply(`*AI MENU*\n🔹 .ai <text>\n🔹 .ask <question>`);
          } else if (replyNumber === '4') {
            await reply(`*SEARCH MENU*\n🔹 .anime <text>\n🔹 .weather <location>`);
          } else if (replyNumber === '5') {
            await reply(`*DOWNLOAD MENU*\n🔹 .song <text>\n🔹 .video <text>\n🔹 .fb <link>`);
          } else if (replyNumber === '6') {
            await reply(`*MAIN MENU*\n🔹 .alive\n🔹 .menu\n🔹 .system\n🔹 .owner`);
          } else if (replyNumber === '7') {
            await reply(`*CONVERT MENU*\n🔹 .sticker <reply img>\n🔹 .toimg <reply sticker>`);
          } else if (replyNumber === '8') {
            await reply(`*OTHER MENU*\n🔹 .help\n🔹 .info`);
          } else if (replyNumber === '9') {
            await reply(`*LOGO MENU*\n🔹 .logo <text>\n🔹 .genlogo <text>`);
          } else if (replyNumber === '10') {
            await reply(`*FUN MENU*\n🔹 .joke\n🔹 .meme`);
          } else if (replyNumber === '11') {
            await reply(`*GROUP MENU*\n🔹 .mute\n🔹 .kick\n🔹 .promote`);
          } else {
            await reply(`Invalid option. Please reply with a number from 1 to 11.`);
          }
        }
      });

    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
