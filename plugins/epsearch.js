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
      let response = await axios.get(apiUrl);
      let data = response.data;

      // In case data is returned as a string, try parsing it
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (err) {
          console.error("JSON parse error:", err);
        }
      }

      console.log("Eporner API Response:", data);

      let results = [];

      // Check if data.results exists and is an array
      if (data.results && Array.isArray(data.results)) {
        results = data.results;
      } 
      // If data is an array
      else if (Array.isArray(data)) {
        results = data;
      } 
      // If data is an object, try converting its values to an array
      else if (typeof data === "object" && data !== null) {
        results = Object.values(data);
      }

      // Debug: Log the results array
      console.log("Parsed Results:", results);

      if (results.length === 0) {
        return reply("No results found!");
      }

      // Find first result that has a title property
      const firstResult = results.find(r => r && r.title);
      if (!firstResult) {
        return reply("No valid results found!");
      }

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
