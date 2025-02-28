const { cmd } = require("../command");
const axios = require("axios");
const cheerio = require("cheerio");

cmd(
  {
    pattern: "pt",
    react: "✏️",
    desc: "Search and Download from Pinterest",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, command, args, q, reply }
  ) => {
    try {
      if (!q) return reply("*Provide a Pinterest search query or a valid URL.* 📌");

      const pin = new Pinterest();

      // If it's a URL, download the media
      if (q.includes("pin.it") || q.includes("pinterest.com")) {
        reply("*📌 Pinterest URL detected! Downloading...*");

        const response = await pin.download(q);

        if (response.download) {
          let caption = `🎯 *PINTEREST DOWNLOAD* 🎯
          
📌 *Title* : ${response.title}
👤 *Author* : ${response.author.name}`;

          await robin.sendMessage(
            from,
            { image: { url: response.download }, caption },
            { quoted: mek }
          );
        } else {
          reply(response.msg || "❌ *Media not found!*");
        }
        return;
      }

      // If it's a search query, find images
      const results = await pin.search(q);
      if (!results.length) throw "❌ *No results found!*";

      const data = results[0];
      let caption = `🎯 *PINTEREST SEARCH RESULT* 🎯
      
📌 *Title* : ${data.title}
📅 *Created At* : ${data.create_at}
👤 *Author* : ${data.author}
🔗 *Source* : ${data.source}`;

      await robin.sendMessage(
        from,
        { image: { url: data.image }, caption },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);

class Pinterest {
  async search(query) {
    try {
      const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      let results = [];

      $("img").each((i, elem) => {
        let title = $(elem).attr("alt") || "No Title";
        let image = $(elem).attr("src");

        if (image) {
          results.push({ title, image, source: url });
        }
      });

      return results;
    } catch (error) {
      console.error("Error fetching Pinterest search results:", error);
      return [];
    }
  }

  async download(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      const $ = cheerio.load(response.data);
      let image = $('meta[property="og:image"]').attr("content");

      if (!image) {
        return { msg: "❌ *Media not found!*" };
      }

      return {
        title: $("title").text(),
        download: image,
        author: { name: "Unknown" },
      };
    } catch (error) {
      return { msg: "❌ Error, please try again later!" };
    }
  }
}
