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

      const fbVideoUrl = q;

      // Log the URL to check if it is properly passed
      console.log(`Facebook URL received: ${fbVideoUrl}`);

      // API URL with your key and the video URL
      const apiUrl = `https://mr-manul-ofc-apis.vercel.app/facebook-dl?apikey=Manul-Official-Key-3467&facebookUrl=${encodeURIComponent(fbVideoUrl)}`;

      // Log the full API URL to check if it's formatted correctly
      console.log(`API Request URL: ${apiUrl}`);

      // Send request to the API to fetch download link
      const response = await axios.get(apiUrl);

      // Log the full response to understand its structure
      console.log(`API Response: ${JSON.stringify(response.data)}`);

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
