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
      if (!fbRegex.test(q))
        return reply("*Invalid Facebook URL! Please check and try again.* 🌚");

      // Fetch video details
      reply("*Downloading your video...* 💤");
      const apiUrl = `https://api.genux.me/api/download/fb?url=${encodeURIComponent(
        q
      )}&apikey=GENUX-PANSILU-NETHMINA-`;

      // Request the Genux API
      const response = await axios.get(apiUrl);
      console.log("Full Genux API Response:", JSON.stringify(response.data, null, 2));

      const result = response.data.result;
      if (!result || result.length === 0) {
        return reply("*No downloadable video found!* 😮‍💨");
      }

      // Check and handle result for multiple qualities
      const videoResult = result[0]; // Taking the first object for now
      const { quality, url } = videoResult;
      if (!url) {
        return reply("*Failed to download video. No URL found!* 😥");
      }

      let caption = `*❤️ 𝙑𝙊𝙍𝙏𝙀𝙓 FB VIDEO DOWNLOADER ❤️*  👻 *Quality*: ${quality || "Unknown"}  𝐌𝐚𝐝𝐞 𝐛𝐲 𝙋𝙖𝙣𝙨𝙞𝙡𝙪 𝙉𝙚𝙩𝙝𝙢𝙞𝙣𝙖`;

      // Send the video
      await robin.sendMessage(
        from,
        { video: { url: url }, caption: caption },
        { quoted: mek }
      );

      return reply("𝘿𝙊𝙉𝙀 📥 ");
    } catch (e) {
      console.error(e);
      reply(`*Error:* ${e.message || e}`);
    }
  }
);
