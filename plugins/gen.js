const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "gen",
    alias: ["imagine"],
    react: "💧",
    desc: "Generate AI images using FluxAI API.",
    category: "ai",
    use: ".gen <Your Question>",
    filename: __filename
  },
  async (conn, mek, msg, { reply, args }) => {
    try {
      const text = args.join(" ");
      if (!text) {
        return reply("❗️ Please provide a prompt.");
      }

      const apiUrl = `https://manul-ofc-tech-api-1e5585f5ebef.herokuapp.com/fluxai?prompt=${encodeURIComponent(text)}`;

      await conn.sendMessage(msg.key.remoteJid, { react: { text: "🎨", key: msg.key } });

      // Fetch the image from API
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

      // Send image as buffer
      await conn.sendMessage(msg.key.remoteJid, { 
        image: Buffer.from(response.data), 
        caption: `🖼 Generated Image for: *${text}*`
      });

    } catch (error) {
      console.error("Error:", error);
      reply("❌ Error generating image.");
    }
  }
);
