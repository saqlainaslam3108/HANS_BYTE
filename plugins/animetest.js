const { cmd } = require("../command");
const { search, getep, dl } = require("darksadasyt-anime");
const axios = require("axios");

cmd(
  {
    pattern: "anime",
    react: "🎬",
    desc: "Download Anime Episode",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("*Please provide an anime name or link.* 🎬❤️");

      // Search for anime
      const results = await search(q);
      if (results.length === 0) {
        return reply("No anime found for that search query.");
      }
      const anime = results[0];
      const animeLink = anime.link;

      // Fetch anime details and episodes
      const details = await getep(animeLink);
      const episodes = details.results;
      const animeTitle = details.result.title;

      if (episodes.length === 0) {
        return reply("No episodes found for this anime.");
      }

      // Send episode list to user
      let episodeList = `🎬 *${animeTitle}* - Available Episodes:\n`;
      episodes.forEach((ep, i) => {
        episodeList += `\n${i + 1}. Episode ${ep.episode}`;
      });
      await robin.sendMessage(from, { text: episodeList }, { quoted: mek });
      reply("Please send the episode number you want to download.");

      // Wait for user response with a timeout of 60 seconds
      let response;
      try {
        const filter = (msg) => msg.from === sender && !isCmd;
        response = await robin.waitForMessage(from, filter, 60000);
      } catch (err) {
        return reply("Timed out. Please try again and send the episode number faster.");
      }
      const episodeNumber = parseInt(response.body, 10);

      if (isNaN(episodeNumber) || episodeNumber < 1 || episodeNumber > episodes.length) {
        return reply("Invalid episode number.");
      }

      const selectedEpisode = episodes[episodeNumber - 1];
      const epLink = `https://animeheaven.me/${selectedEpisode.url}`;

      // Get download URL using dl function
      const downloadLinks = await dl(epLink);
      if (downloadLinks.length === 0) {
        return reply("No download link found for that episode.");
      }
      // Usually the last link is the video URL
      const videoUrl = downloadLinks[downloadLinks.length - 1];

      // Send video
      await robin.sendMessage(
        from,
        {
          video: { url: videoUrl },
          caption: `🎬 *${animeTitle}* - Episode ${selectedEpisode.episode}`,
        },
        { quoted: mek }
      );
      reply("*Thank you for using the bot!* 🎬❤️");
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
