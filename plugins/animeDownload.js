const { cmd } = require("../command");
const { dl, getep } = require("darksadasyt-anime");

cmd(
  {
    pattern: "downloadAnime",
    react: "🎬",
    desc: "Download Anime Episode",
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
      if (!q) return reply("*Please provide the anime episode link to download.* 🎬");

      // Fetch episode details from the provided link
      const episodeDetails = await getep(q);
      
      // Check if the episode URL has extra or repeated 'episode.php'
      let episodeLink = episodeDetails.results[0]?.url;

      if (episodeLink && episodeLink.includes("episode.php?episode.php")) {
        // Clean up the URL by removing the duplicate 'episode.php' part
        episodeLink = episodeLink.replace("episode.php?", "");
      }

      // Now fetch download links for the cleaned episode URL
      const results = await dl(`https://animeheaven.me/${episodeLink}`);

      if (results && results.length > 0) {
        const videoUrl = results[2];  // Typically, the 3rd result contains the video download URL

        if (videoUrl) {
          // Send the video to the user
          await robin.sendMessage(
            from,
            {
              video: { url: videoUrl },
              caption: `🎬 Downloading Anime Episode 🎬`,
            },
            { quoted: mek }
          );
        } else {
          reply("❌ Error: No valid download link found.");
        }
      } else {
        reply("❌ Error: Unable to fetch download links.");
      }
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
