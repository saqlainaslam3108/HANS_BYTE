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
      console.log("Full API Response:", JSON.stringify(data, null, 2)); // Debugging

      if (!data || !data.data || !data.data.results || data.data.results.length === 0) {
        return reply("❌ *Failed to retrieve video link.*");
      }

      console.log("Results Array:", data.data.results); // Debugging

      // HD & SD video URLs ගන්න
      const videos = data.data.results.map(v => ({
        type: v.type,
        url: v.url,
      }));

      console.log("Extracted Videos:", videos); // Debugging

      const hdVideo = videos.find(video => video.type === "HD");
      const sdVideo = videos.find(video => video.type === "SD");

      const videoUrl = hdVideo ? hdVideo.url : sdVideo ? sdVideo.url : null;

      if (!videoUrl) {
        return reply("❌ *No downloadable video found!*");
      }

      // Video direct link එකෙන් යවන්න
      await robin.sendMessage(
        from,
        {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          caption: "Here is your requested video 🎬"
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
