const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "hentai",
    react: "🔞",
    desc: "Search and send hentai direct link from Eporner",
    category: "nsfw",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) {
        return reply("Please provide a search query for hentai.");
      }

      // API URL with query
      const apiUrl = `https://nsfw-api-pinkvenom.vercel.app/api/eporner/search?query=${encodeURIComponent(
        q
      )}`;
      const response = await axios.get(apiUrl);

      // Assuming the API returns an object with results array
      if (response.data && response.data.results && response.data.results.length > 0) {
        // Use the first search result
        const result = response.data.results[0];

        // Build a message text
        let messageText = `🔞 *Hentai Search Result* 🔞\n\n`;
        messageText += `*Title:* ${result.title || "Unknown"}\n`;
        messageText += `*Direct Link:* ${result.url || "Not available"}\n`;
        if (result.description) {
          messageText += `*Description:* ${result.description}\n`;
        }

        // Send image with caption if thumbnail exists
        if (result.thumbnail) {
          await robin.sendMessage(
            from,
            { image: { url: result.thumbnail }, caption: messageText },
            { quoted: mek }
          );
        } else {
          // Otherwise send plain text message
          await robin.sendMessage(from, { text: messageText }, { quoted: mek });
        }
      } else {
        reply("No results found for your query.");
      }
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
