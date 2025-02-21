const { cmd } = require("../command");
const { search, getep } = require('darksadasyt-anime');
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
      if (!q) return reply("*Provide an anime name or link to search for episodes.* 🎬❤️");

      // Search for the anime
      const searchResults = await search(q);
      if (searchResults.length === 0) {
        return reply("No anime found for that search query.");
      }

      const anime = searchResults[0];
      const animeLink = anime.link;

      // Fetch anime details and episodes
      const episodeDetails = await getep(animeLink);
      const episodes = episodeDetails.results;
      const animeTitle = episodeDetails.result.title;

      if (episodes.length === 0) {
        return reply("No episodes found for this anime.");
      }

      let episodeList = "🎬 *Available Episodes* 🎬\n";
      episodes.forEach((ep, index) => {
        episodeList += `\n${index + 1}. *Episode ${ep.episode}*`;
      });

      // Send the list of episodes
      await robin.sendMessage(
        from,
        { text: `🎬 *Anime:* ${animeTitle}\n${episodeList}` },
        { quoted: mek }
      );

      // Ask for episode number to download
      reply("Please select an episode number to download.");

      // Wait for the user to provide an episode number
      const filter = (message) => message.from === sender && !isCmd;
      const response = await robin.waitForMessage(from, filter, 60000);
      const episodeNumber = parseInt(response.body, 10);

      if (isNaN(episodeNumber) || episodeNumber < 1 || episodeNumber > episodes.length) {
        return reply("Invalid episode number.");
      }

      const selectedEpisode = episodes[episodeNumber - 1];
      const downloadUrl = `https://animeheaven.me/${selectedEpisode.url}`;

      // Debugging: Print the download URL
      console.log(`Attempting to download from URL: ${downloadUrl}`);

      // Manually extract the video download URL
      const downloadPage = await axios.get(downloadUrl);
      const regex = /"https:\/\/e[0-9].animeheaven.me\/video.mp4[^"]+"/;
      const match = downloadPage.data.match(regex);
      
      if (match && match[0]) {
        const videoUrl = match[0].slice(1, -1); // Remove the surrounding quotes
        
        // Send the video download link
        await robin.sendMessage(
          from,
          { video: { url: videoUrl }, caption: `🎬 *Downloading Episode ${selectedEpisode.episode}* 🎬` },
          { quoted: mek }
        );
        reply("*Thanks for using my bot!* 🎬❤️");
      } else {
        reply("Sorry, I couldn't fetch the download link for that episode.");
      }

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
