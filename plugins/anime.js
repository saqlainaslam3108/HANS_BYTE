const { cmd } = require("../command");
const { search, getep, dl } = require("darksadasyt-anime");
const axios = require("axios");
const fs = require("fs");

cmd(
  {
    pattern: "anime",
    react: "🎭",
    desc: "Search for an anime",
    category: "anime",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("*📢 Provide an anime name to search!*");

      let results = await search(q);

      if (!results.length) {
        return reply("❌ No anime found!");
      }

      let response = `🔍 *Search Results for:* _${q}_\n\n`;
      results.forEach((anime, index) => {
        response += `*${index + 1}.* ${anime.title}\n🔗 Link: ${anime.link}\n\n`;
      });

      return reply(response);
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);

cmd(
  {
    pattern: "getep",
    react: "📺",
    desc: "Get anime episodes",
    category: "anime",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("*📢 Provide an anime link to get episodes!*");

      let results = await getep(q);

      if (!results.results.length) {
        return reply("❌ No episodes found!");
      }

      let response = `🎬 *Episodes for:* _${results.result.title}_\n\n`;
      results.results.forEach((ep) => {
        response += `📺 Episode ${ep.episode} - 🔗 ${ep.url}\n`;
      });

      return reply(response);
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);

cmd(
  {
    pattern: "download",
    react: "📥",
    desc: "Download an anime episode",
    category: "anime",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("*📢 Provide an episode link to download!*");

      let downloadLinks = await dl(q);

      if (!downloadLinks.length) {
        return reply("❌ No download link found!");
      }

      let videoUrl = downloadLinks[downloadLinks.length - 1]; // Use the last link
      let fileName = `anime_${Date.now()}.mp4`;

      reply("⏳ Downloading episode, please wait...");

      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(fileName);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        await robin.sendMessage(from, {
          video: fs.readFileSync(fileName),
          caption: "🎬 Here is your episode!",
        });

        fs.unlinkSync(fileName); // Delete after sending
      });

      writer.on("error", (err) => {
        console.error(err);
        reply("❌ Error downloading the file!");
      });
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
