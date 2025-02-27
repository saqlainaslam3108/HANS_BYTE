const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "txt2img",
    alias: ["t2i"],
    react: "💤",
    desc: "Generate AI images using Promt.",
    category: "ai",
    use: ".txt2img <Your Question>",
    filename: __filename
  },
  async (conn, mek, msg, { reply, args }) => {
    try {
      const text = args.join(" ");
      if (!text) {
        return reply("❗️ Please provide a prompt.");
      }

      const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;

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
