const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "fb",
    alias: ["facebook"],
    react: "😶‍🌫️",
    desc: "Download Facebook Video",
    category: "download",
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
      if (!q) return reply("*Please provide a valid Facebook video URL!* ❤️");

      // Validate the Facebook URL format
      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q)) return reply("*Invalid Facebook URL! Please check and try again.* 🌚");

      // Fetch video details using Genux API
      reply("*Downloading your video...* 💤");

      const apiUrl = `https://api.genux.me/api/download/fb?url=${encodeURIComponent(q)}&apikey=GENUX-PANSILU-NETHMINA-`;

      const response = await axios.get(apiUrl);
      console.log("Genux API Response:", response.data); // Debugging: Log the response

      const result = response.data.result[0]; // Get the first video result

      if (!result || !result.url) {
        return reply("*Failed to download video. Please try again later.* 😥");
      }

      const { quality, url } = result;

      // Prepare and send the message with video details
      let desc = `*❤️ 𝙑𝙊𝙍𝙏𝙀𝙓 FB VIDEO DOWNLOADER ❤️*  
👻 *Quality*: ${quality || "Unknown"}  
𝐌𝐚𝐝𝐞 𝐛𝐲 𝙋𝙖𝙣𝙨𝙞𝙡𝙪 𝙉𝙚𝙩𝙝𝙢𝙞𝙣𝙖`;

      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(10).jpeg",
          },
          caption: desc,
        },
        { quoted: mek }
      );

      // Send the video URL
      await robin.sendMessage(
        from,
        { video: { url: url }, caption: "Download your Facebook video" },
        { quoted: mek }
      );

      return reply("𝘿𝙊𝙉𝙀 📥");
    } catch (e) {
      console.error(e);
      reply(`*Error:* ${e.message || e}`);
    }
  }
);
