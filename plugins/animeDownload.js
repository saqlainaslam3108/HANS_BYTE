const { cmd } = require("../command");
const { dl } = require("darksadasyt-anime");

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
      if (!q) return reply("*Please provide the episode link to download.* 🎬");

      // Fetching the download link for the episode
      const results = await dl(q);
      
      // Checking if the results contain a valid video URL
      if (results && results.length > 0) {
        const videoUrl = results[2];  // The third result is typically the video download URL

        if (videoUrl) {
          // Sending the video to the user
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
