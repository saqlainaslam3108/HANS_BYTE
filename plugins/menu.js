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
✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧
  *HANS BYTE MD*
✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧

╭─⊳⋅🤖 𝕮𝖔𝖗𝖊 𝖀𝖙𝖎𝖑𝖘 ⋅⊲─╮
⌬ ${config.PREFIX}alive
⌬ ${config.PREFIX}menu
⌬ ${config.PREFIX}system
⌬ ${config.PREFIX}owner

╭─⊳⋅⛩️ 𝕬𝖓𝖎𝖒𝖊 ⋅⊲─╮
⌬ ${config.PREFIX}anime
⌬ ${config.PREFIX}andl
⌬ ${config.PREFIX}download
⌬ ${config.PREFIX}animedetails


╭─⊳⋅📡 𝕬𝕴 ⋅⊲─╮
⟠ ${config.PREFIX}ai 
⟠ ${config.PREFIX}gpt 
⟠ ${config.PREFIX}gemini 
⟠ ${config.PREFIX}deepseek
⟠ ${config.PREFIX}claude
⟠ ${config.PREFIX}meta ai


╭─⊳⋅🎵 𝕸𝖊𝖉𝖎𝖆 𝕿𝖔𝖔𝖑𝖘 ⋅⊲─╮
⭒ ${config.PREFIX}sticker
⭒ ${config.PREFIX}toimg
⭒ ${config.PREFIX}gen / dalle <text>
⭒ ${config.PREFIX}txt2img
⭒ ${config.PREFIX}shorten <url>
⭒ ${config.PREFIX}tourl
⭒ ${config.PREFIX}movie
⭒ ${config.PREFIX}img
⭒ ${config.PREFIX}gifsearch
⭒ ${config.PREFIX}vv


╭─⊳⋅⬇️ 𝕯𝖔𝖜𝖓𝖑𝖔𝖆𝖉𝖊𝖗𝖘 ⋅⊲─╮
⋗ 𝘼𝙪𝙙𝙞𝙤:
  ⇝ ${config.PREFIX}song <title>
  ⇝ ${config.PREFIX}ttmp3
  ⇝ ${config.PREFIX}spotify
⋗ 𝙑𝙞𝙙𝙚𝙤:
  ⇝ ${config.PREFIX}video <query>
  ⇝ ${config.PREFIX}fb <link>
  ⇝ ${config.PREFIX}ttmp4
  ⇝ ${config.PREFIX}insta
⋗ 𝙁𝙞𝙡𝙚𝙨:
  ⇝ ${config.PREFIX}dl <url>
  ⇝ ${config.PREFIX}mediafire
  ⇝ ${config.PREFIX}rtik
  ⇝ ${config.PREFIX}tiktok
  ⇝ ${config.PREFIX}gdrive 

⋗ 𝐀𝐏𝐏:
 ⇝ ${config.PREFIX}apk

╭─⊳⋅🔍 𝕾𝖊𝖆𝖗𝖈𝖍 𝕰𝖓𝖌𝖎𝖓𝖊𝖘 ⋅⊲─╮
⨳ ${config.PREFIX}anime
⨳ ${config.PREFIX}img
⨳ ${config.PREFIX}weather

╭─⊳⋅✞ 𝓡𝓔𝓵𝓲𝓰𝓲𝓸𝓷⋅⊲─╮
⤞ ${config.PREFIX}bible 
⤞ ${config.PREFIX}quran


╭─⊳⋅🗞️ 𝕹𝖊𝖜𝖘 𝕱𝖊𝖊𝖉𝖘 ⋅⊲─╮
⨠ ${config.PREFIX}hirunews
⨠ ${config.PREFIX}itnnews

╭─⊳⋅🛠️ 𝕾𝖞𝖘𝖙𝖊𝖒 𝕮𝖔𝖓𝖙𝖗𝖔𝖑 ⋅⊲─╮
⚙ ${config.PREFIX}restart
⚙ ${config.PREFIX}leave
⚙ ${config.PREFIX}block

╭─⊳⋅👥 𝕲𝖗𝖔𝖚𝖕 𝕸𝖌𝖒𝖙 ⋅⊲─╮
✫ ${config.PREFIX}mute
✫ ${config.PREFIX}unmute
✫ ${config.PREFIX}promote
✫ ${config.PREFIX}demote
✫ ${config.PREFIX}kick
✫ ${config.PREFIX}add
✫ ${config.PREFIX}gcpp
✫ ${config.PREFIX}fullpp
✫ ${config.PREFIX}gclink
✫ ${config.PREFIX}tagall
✫ ${config.PREFIX}take
✫ ${config.PREFIX}kickall
✫ ${config.PREFIX}kickall2
✫ ${config.PREFIX}kickadmins


╭─⊳⋅🌐 𝕷𝖔𝖈𝖆𝖑𝖎𝖟𝖆𝖙𝖎𝖔𝖓 ⋅⊲─╮
⎇ ${config.PREFIX}sinhala

╭─⊳⋅🔞 𝕹𝕾𝕱𝖂 ⋅⊲─╮
⤷ ${config.PREFIX}xnxx-dl
⤷ ${config.PREFIX}epsearch
⤷ ${config.PREFIX}epdownload
⤷ ${config.PREFIX}hentai


✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧
 *HANS BYTE MD*
✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧
`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://i.ibb.co/6Rxhg321/Chat-GPT-Image-Mar-30-2025-03-39-42-AM.png",
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
