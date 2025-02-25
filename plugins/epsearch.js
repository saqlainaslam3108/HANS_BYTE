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

      if (!data || !data.results || data.results.length === 0) {
        return reply("No results found!");
      }

      const firstResult = data.results[0];

      let messageText = `*🎥 EPORNER SEARCH RESULT*\n\n`;
      messageText += `🔎 *Query:* ${q}\n`;
      messageText += `📌 *Title:* ${firstResult.title}\n`;
      messageText += `🔗 *URL:* ${firstResult.link}\n`;
      messageText += `🖼️ *Thumbnail:* ${firstResult.thumbnail}\n\n`;
      messageText += `⚡ Use *${prefix}epdownload <url>* to download the video.`;

      // Send the search result as text message. 
      // (You can also send the thumbnail image with a caption if preferred)
      await robin.sendMessage(from, { text: messageText }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
