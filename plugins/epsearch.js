const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "epsearch",
    react: "🎥",
    desc: "Search NSFW videos from Eporner",
    category: "nsfw",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, prefix, reply }) => {
    try {
      if (!q) return reply(`Use: ${prefix}epsearch <query>`);

      const apiUrl = `https://nsfw-api-pinkvenom.vercel.app/api/eporner/search?query=${encodeURIComponent(q)}`;
      const { data } = await axios.get(apiUrl);

      // Debug: log the API response
      console.log("Eporner API Response:", data);

      // Check if data is an array, if not try to access data.results
      let results = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (data.results && Array.isArray(data.results)) {
        results = data.results;
      }

      if (results.length === 0) {
        return reply("No results found!");
      }

      const firstResult = results[0];

      // Use "videoUrl" instead of "link" if available
      let videoLink = firstResult.videoUrl || firstResult.link || "No link provided";

      let messageText = `*🎥 EPORNER SEARCH RESULT*\n\n`;
      messageText += `🔎 *Query:* ${q}\n`;
      messageText += `📌 *Title:* ${firstResult.title}\n`;
      messageText += `🔗 *URL:* ${videoLink}\n`;
      messageText += `⏱️ *Duration:* ${firstResult.duration || "N/A"}\n`;
      messageText += `👁️ *Views:* ${firstResult.views || "N/A"}\n`;
      messageText += `⭐ *Rating:* ${firstResult.rating || "N/A"}\n`;
      messageText += `👤 *Uploader:* ${firstResult.uploader || "N/A"}\n\n`;
      messageText += `⚡ Use *${prefix}epdownload <url>* to download the video.`;

      // Note: If you have a thumbnail URL in the data, you can send it as an image.
      await robin.sendMessage(from, { text: messageText }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
