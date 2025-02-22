const { cmd } = require("../command");
const { nexo } = require("nexo-aio-downloader");

cmd(
  {
    pattern: "test",  // Command to trigger the download
    react: "🎥",  // React emoji
    desc: "Download YouTube video with resolution options",  // Command description
    category: "download",  // Category of command
    filename: __filename,  // Current filename (for logging)
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("*Please provide a valid YouTube link and quality option.* 🎥❤️");

      // Default resolution to 5 (1080p) if not provided
      let res = parseInt(args[0]) || 5;
      if (res < 1 || res > 7) res = 5;

      const resolutions = {
        1: "144p",
        2: "360p",
        3: "480p",
        4: "720p",
        5: "1080p",
        6: "1440p",
        7: "2160p",
      };

      // Download the video with the specified quality
      const videoInfo = await nexo.youtube(q, res);
      if (!videoInfo.status) throw new Error("Video not found");

      const { title, desc, channel, uploadDate, size, thumb, result } = videoInfo.data;
      const formattedSize = formatBytes(size);

      // Video metadata description
      let descMessage = `🎥 *Video Downloader* 🎥\n
      👻 *Title* : ${title}\n
      👻 *Duration* : ${uploadDate}\n
      👻 *Channel* : ${channel}\n
      👻 *Resolution* : ${resolutions[res]}\n
      👻 *Size* : ${formattedSize}\n
      👻 *Description* : ${desc || "No Description"}`;

      // Send video thumbnail and metadata
      await robin.sendMessage(
        from,
        { image: { url: thumb }, caption: descMessage },
        { quoted: mek }
      );

      // Send the video file
      await robin.sendMessage(
        from,
        {
          document: result,
          mimetype: "video/mp4",
          fileName: `${title}.mp4`,
          caption: `🎥 *${title}*`,
        },
        { quoted: mek }
      );

      reply("*Thanks for using my bot!* 🎥❤️");
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);

// Utility function to format size
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}
