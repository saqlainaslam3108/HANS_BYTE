const { cmd } = require("../command");
const axios = require("axios");

// Fetch function with retry mechanism and timeout
const fetchHentaiData = async (apiUrl, retries = 3, timeout = 30000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(apiUrl, { timeout });
      return response.data;
    } catch (err) {
      if (i === retries - 1) {
        throw err;
      }
      // Wait for 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

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
        return reply("කරුණාකර search query එකක් දෙන්න.");
      }

      // API URL with encoded query
      const apiUrl = `https://nsfw-api-pinkvenom.vercel.app/api/eporner/search?query=${encodeURIComponent(q)}`;
      
      // Fetch data from API using retry mechanism
      const data = await fetchHentaiData(apiUrl);
      
      // Check if API returns valid results (assuming results array exists)
      if (data && data.results && data.results.length > 0) {
        // Use the first result
        const result = data.results[0];
        let messageText = `🔞 *Hentai Search Result* 🔞\n\n`;
        messageText += `*Title:* ${result.title || "Unknown"}\n`;
        messageText += `*Direct Link:* ${result.url || "Not available"}\n`;
        if (result.description) {
          messageText += `*Description:* ${result.description}\n`;
        }

        // Send message with thumbnail if available
        if (result.thumbnail) {
          await robin.sendMessage(
            from,
            { image: { url: result.thumbnail }, caption: messageText },
            { quoted: mek }
          );
        } else {
          await robin.sendMessage(from, { text: messageText }, { quoted: mek });
        }
      } else {
        reply("ඔබගේ query එක සඳහා කිසිදු ප්‍රතිඵලයක් හමුවෙලා නැත.");
      }
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
