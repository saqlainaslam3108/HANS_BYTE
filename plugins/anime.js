const { cmd } = require("../command");
const { search, getep, dl } = require("darksadasyt-anime");
const axios = require("axios");

cmd(
  {
    pattern: "anime",
    react: "🎭",
    desc: "Search Anime and Get Episode Links",
    category: "anime",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("*Please provide an anime name.* 🎭");

      // Search for the anime
      const results = await search(q);
      if (results.length === 0) return reply("No anime found with that name!");

      let animeList = "🎬 *Anime Search Results* 🎬\n\n";
      results.forEach((anime, index) => {
        animeList += `${index + 1}. ${anime.title} - Link: ${anime.link}\n`;
      });

      reply(animeList);

      // Assuming the user picks the first result
      const animeLink = results[0].link;

      // Get episodes for the chosen anime
      const episodeData = await getep(animeLink);
      let episodeList = `🎬 *Episodes for:* ${episodeData.result.title} 🎬\n\n`;
      episodeData.results.forEach((episode, index) => {
        episodeList += `📺 Episode ${episode.episode} - 🔗 ${episode.url}\n`;
      });

      reply(episodeList);
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
