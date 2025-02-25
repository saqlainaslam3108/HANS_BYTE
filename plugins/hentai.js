const axios = require("axios");

module.exports = {
  name: "epsearch",
  alias: ["eporner"],
  category: "nsfw",
  desc: "Search videos from Eporner",
  use: "<query>",
  
  async execute(m, { text, prefix }) {
    if (!text) return m.reply(`Use: ${prefix}epsearch <query>`);

    let apiUrl = `https://nsfw-api-pinkvenom.vercel.app/api/eporner/search?query=${encodeURIComponent(text)}`;

    try {
      let { data } = await axios.get(apiUrl);

      if (!data || data.results.length === 0) return m.reply("No results found!");

      let firstResult = data.results[0]; // පලවෙනි එක ගන්නවා
      
      let message = `*🎥 EPORNER SEARCH*\n\n`;
      message += `🔎 *Query:* ${text}\n`;
      message += `📌 *Title:* ${firstResult.title}\n`;
      message += `🔗 *URL:* ${firstResult.link}\n`;
      message += `🖼️ *Thumbnail:* ${firstResult.thumbnail}\n\n`;
      message += `⚡ Use *${prefix}epdownload <url>* to download the video.`;

      await m.reply(message);
    } catch (error) {
      console.error(error);
      m.reply("❌ Error fetching data!");
    }
  }
};
