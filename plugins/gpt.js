const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "gpt",
    alias: ["chatgpt"],
    react: "💬",
    desc: "Chat with AI using Manu API.",
    category: "ai",
    use: ".ai-chat <Your Message>",
    filename: __filename
  },
  async (conn, mek, msg, { reply, args }) => {
    try {
      const userMessage = args.join(" ");
      if (!userMessage) {
        return reply("❗️ Please provide a message.");
      }

      const apiUrl = `https://manul-ofc-api-site-afeb13f3dabf.herokuapp.com/manu-ai-chat?q=${encodeURIComponent(userMessage)}`;

      // React with chat emoji
      await conn.sendMessage(msg.key.remoteJid, { react: { text: "💬", key: msg.key } });

      // API request to fetch AI response
      const response = await axios.get(apiUrl);

      // Check if the response contains AI reply
      if (response.data && response.data.reply) {
        const aiReply = response.data.reply;
        await reply(aiReply);
      } else {
        return reply("❌ API did not return a valid response.");
      }

    } catch (error) {
      console.error("Error:", error);
      reply("❌ Error fetching AI response.");
    }
  }
);
