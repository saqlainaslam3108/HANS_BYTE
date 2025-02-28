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

      reply("🔄 *Fetching Facebook video link...*");

      // API response එක ගන්න
      const { data } = await axios.get(apiUrl);
      console.log("API Response:", data); // Debugging

      if (!data || !data.data || !data.data.results || data.data.results.length === 0) {
        return reply(`❌ *Failed to retrieve video link.*\n\n*API Response:* ${JSON.stringify(data, null, 2)}`);
      }

      // HD quality URL එක තිබ්බොත් එනවා, නැත්තම් SD URL එක
      const hdVideo = data.data.results.find(video => video.type === "HD");
      const sdVideo = data.data.results.find(video => video.type === "SD");

      const videoUrl = hdVideo ? hdVideo.url : sdVideo ? sdVideo.url : null;
      const quality = hdVideo ? "HD" : "SD";

      if (!videoUrl) {
        return reply("❌ *No downloadable video found!*");
      }

      reply(`🔄 *Downloading ${quality} quality video...*`);

      // Video එක buffer එකක් විදිහට ගන්න
      const videoBuffer = await axios.get(videoUrl, { responseType: "arraybuffer" });

      // Video යවන්න
      await robin.sendMessage(
        from,
        {
          video: videoBuffer.data,
          mimetype: "video/mp4",
          caption: `✅ *Here is your ${quality} quality Facebook video!* 📥`,
        },
        { quoted: mek }
      );

      reply(`✅ *Your ${quality} quality video has been uploaded successfully!* 📤`);
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
