const { cmd } = require("../command");
const axios = require("axios");
const path = require("path");

cmd(
  {
    pattern: "facebookvideo",
    react: "🎥",
    desc: "Download Facebook video",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("*Provide a Facebook video URL to download.* 🎥");

      // Construct the API URL
      const apiUrl = `https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(q)}`;

      // Fetch video download URL from API
      const response = await axios.get(apiUrl);
      if (response.data.status !== "success") {
        return reply("❌ Failed to fetch video. Please check the URL and try again.");
      }

      const videoUrl = response.data.result.url;

      // Get the file as a buffer
      const videoBuffer = await axios.get(videoUrl, { responseType: "arraybuffer" });

      // Get file name from the URL
      const videoName = path.basename(videoUrl);

      // Send the video to the user
      await robin.sendMessage(
        from,
        {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          caption: `Here is your Facebook video! 🎥`,
        },
        { quoted: mek }
      );

      reply(`*Your Facebook video has been downloaded successfully!* 🎥`);
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
