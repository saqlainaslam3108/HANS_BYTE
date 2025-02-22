const { cmd } = require("../command");
const { youtube } = require("nexo-aio-downloader");

cmd(
  {
    pattern: "test",
    react: "🎥",
    desc: "Download YouTube Video with resolution options",
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
      if (!q) return reply("*Provide a name or a YouTube link.* 🎥❤️");

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

      // Get the video information
      const videoInfo = await youtube(q, res);
      if (!videoInfo.status) throw new Error("Video not found");

      const { title, desc, channel, uploadDate, size, quality, thumb, result } = videoInfo.data;
      const formattedSize = formatBytes(size);

      // Video metadata description
      let descMessage = `🎥 *VORTEX VIDEO DOWNLOADER* 🎥
      
👻 *Title* : ${title}
👻 *Duration* : ${uploadDate}
👻 *Channel* : ${channel}
👻 *Resolution* : ${resolutions[res]}
👻 *Size* : ${formattedSize}
👻 *Description* : ${desc || "No Description"}

𝐌𝐚𝐝𝐞 𝐛𝐲 ＰＡＮＳＩＬＵ`;

      // Send metadata and thumbnail message
      await robin.sendMessage(
        from,
        { image: { url: thumb }, caption: descMessage },
        { quoted: mek }
      );

      // Send the video
      await robin.sendMessage(
        from,
        {
          document: result,
          mimetype: "video/mp4",
          fileName: `${title}.mp4`,
          caption: `🎥 *${title}*`
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
