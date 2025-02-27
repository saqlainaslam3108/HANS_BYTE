const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "fbvideo",
    react: "🎥",
    desc: "Download Facebook Video",
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
      if (!q) return reply("*Please provide a Facebook video link.* 🎥❤️");

      // Use the Facebook video URL provided by the user
      const fbVideoUrl = q;

      // API URL with your key and the video URL
      const apiUrl = `https://mr-manul-ofc-apis.vercel.app/facebook-dl?apikey=Manul-Official-Key-3467&facebookUrl=${encodeURIComponent(fbVideoUrl)}`;
      
      // Send request to the API to fetch download link
      const response = await axios.get(apiUrl);
      
      // Check if the response has a valid download link
      if (response.data && response.data.download_url) {
        const downloadUrl = response.data.download_url;
        
        // Send the video download link to the user
        reply(`🎥 *Facebook Video Download Link:*\n\n🔗 ${downloadUrl}\n\nEnjoy! 🎬`);
      } else {
        throw new Error("Could not fetch the video download link.");
      }
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
