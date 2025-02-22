const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

cmd(
  {
    pattern: "ytv",
    react: "🎥",
    desc: "Download YouTube Video",
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

      // Search for the video
      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;

      // Video metadata description
      let desc = `🎥 *VORTEX VIDEO DOWNLOADER* 🎥
      
👻 *Title* : ${data.title}
👻 *Duration* : ${data.timestamp}
👻 *Views* : ${data.views}
👻 *Uploaded* : ${data.ago}
👻 *Channel* : ${data.author.name}
👻 *Link* : ${data.url}

𝐌𝐚𝐝𝐞 𝐛𝐲 ＰＡＮＳＩＬＵ`;

      // Send metadata and thumbnail message
      await robin.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: desc },
        { quoted: mek }
      );

      // Video download function to fetch available resolutions
      const getResolutions = async (url) => {
        const apiUrl = `https://p.oceansaver.in/ajax/download.php?url=${encodeURIComponent(
          url
        )}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
        
        console.log(`API URL: ${apiUrl}`);  // Log the URL for debugging

        const response = await axios.get(apiUrl);
        
        // Log the full response to check the error message
        console.log(response.data);  // Log the response from the API
        
        if (response.data && response.data.success) {
          return response.data.formats; // List of available formats (resolutions)
        } else {
          throw new Error("Failed to fetch video formats.");
        }
      };

      // Fetch available resolutions for the video
      const formats = await getResolutions(url);
      
      // Display available resolutions with numbers
      const availableResolutions = formats
        .map((format, index) => `${index + 1}) ${format.qualityLabel}`)
        .join("\n");

      // Ask the user to choose a resolution by number
      await reply(
        `🎥 *Choose a resolution for the video:*\n\n${availableResolutions}\n\n*Reply with the number of the resolution you want (e.g., 1 for 240p, 2 for 360p, etc.).*`
      );

      // Listen for the user's reply
      robin.on("message", async (msg) => {
        if (msg.from === from && msg.text) {
          const userChoice = parseInt(msg.text.trim());

          if (isNaN(userChoice) || userChoice < 1 || userChoice > formats.length) {
            return reply(
              "*Invalid choice. Please select a valid resolution number from the list.* 🎥"
            );
          }

          // Get the selected format based on the number
          const selectedFormat = formats[userChoice - 1];

          // Download the video in the selected resolution
          const downloadUrl = selectedFormat.url;
          const videoBuffer = await axios.get(downloadUrl, {
            responseType: "arraybuffer",
          });

          // Send the video
          await robin.sendMessage(
            from,
            {
              video: videoBuffer.data,
              caption: `🎥 *${data.title}*`,
            },
            { quoted: mek }
          );

          reply("*Thanks for using my bot!* 🎥❤️");
        }
      });
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
