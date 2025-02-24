const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "hentai",
    alias: ["searchhentai", "nsfwsearch"],
    react: "🍑",
    desc: "Search hentai content and get direct links.",
    category: "nsfw",
    use: ".hentai <Search Query>",
    filename: __filename
  },
  async (conn, mek, msg, { reply, args }) => {
    try {
      const query = args.join(" ");
      if (!query) {
        return reply("❗️ Please provide a search query.");
      }

      const apiUrl = `https://nsfw-api-pinkvenom.vercel.app/api/eporner/search?query=${encodeURIComponent(query)}`;

      await conn.sendMessage(msg.key.remoteJid, { react: { text: "🔍", key: msg.key } });

      // Fetch the search results from the API
      const response = await axios.get(apiUrl);

      if (response.data && response.data.data && response.data.data.length > 0) {
        const firstResult = response.data.data[0];
        const videoLink = firstResult.url;

        // Send the direct link to the user
        await conn.sendMessage(msg.key.remoteJid, {
          text: `🔗 Found a result for "${query}":\n${videoLink}`
        });
      } else {
        reply("❌ No results found.");
      }
      
    } catch (error) {
      console.error("Error:", error);
      reply("❌ Error fetching data.");
    }
  }
);
