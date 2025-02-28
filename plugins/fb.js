const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "fb",
    react: "📥",
    desc: "Download Facebook videos in HD/SD quality",
    category: "download",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, args, q, reply }) => {
    try {
      if (!q) return reply("*Provide a Facebook video link to download.* 📥");

      const fbUrl = q;
      const apiUrl = `https://dark-shan-yt.koyeb.app/download/facebook?url=${encodeURIComponent(fbUrl)}`;

      // API response එක ගන්න
      const { data } = await axios.get(apiUrl);

      // Debugging the API response
      console.log("Full API Response:", JSON.stringify(data, null, 2));

      // Check if the API response has video data
      if (!data || !data.data || !data.data.results || data.data.results.length === 0) {
        return reply("❌ *Failed to retrieve video link.*");
      }

      const videos = data.data.results.map(v => ({
        type: v.type,
        url: v.url,
      }));

      console.log("Extracted Videos:", videos);

      // Check for HD video first
      const hdVideo = videos.find(video => video.type === "HD");
      // Fallback to SD video if HD is not available
      const videoUrl = hdVideo ? hdVideo.url : videos.find(video => video.type === "SD")?.url;

      if (!videoUrl) {
        return reply("❌ *No downloadable video found!*");
      }

      // Check if videoUrl is valid
      if (!videoUrl.startsWith("http")) {
        return reply("❌ *Invalid video URL.*");
      }

      // Send the video
      await robin.sendMessage(
        from,
        {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          caption: "Here is your requested video 🎬",
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
