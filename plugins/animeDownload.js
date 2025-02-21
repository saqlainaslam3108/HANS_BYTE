cmd(
  {
    pattern: "downloadanime",
    react: "🎥",
    desc: "Download Anime",
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
      if (!q) return reply("*Please provide a valid anime episode link.* 🎥❤️");

      // Fetch the download link details
      const results = await dl(q);

      // Get the direct download link (it should be the 3rd result)
      const directLink = results[2]; // This will be the download URL

      if (!directLink) {
        return reply("❌ Video download link not found.");
      }

      // Send the direct download link
      await robin.sendMessage(
        from,
        { text: `🎬 Here's the direct download link for the anime: ${directLink}` },
        { quoted: mek }
      );

      reply("🎥 Your anime download link is ready. Enjoy! 🎉");
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
