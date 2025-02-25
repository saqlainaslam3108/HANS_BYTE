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

      let results = [];

      // If data.results exists and is an array, use it
      if (data.results && Array.isArray(data.results)) {
        results = data.results;
      } 
      // Else if data is an array, use it
      else if (Array.isArray(data)) {
        results = data;
      } 
      // Else if data is an object, convert its values to an array
      else if (typeof data === "object" && data !== null) {
        results = Object.values(data);
      }

      if (results.length === 0) {
        return reply("No results found!");
      }

      const firstResult = results[0];

      // Use "videoUrl" if available, else fallback to "link"
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

      await robin.sendMessage(from, { text: messageText }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
