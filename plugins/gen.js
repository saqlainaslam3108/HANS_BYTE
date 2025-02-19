const { cmd, commands } = require("../command");
const axios = require("axios");

cmd({
  pattern: "gen",
  alias: ["imagine"],
  react: "💧",
  desc: "Generate AI responses using FluxAI API.",
  category: "ai",
  use: ".gen <Your Question>",
  filename: __filename
}, async (conn, mek, msg, { reply, args, pushname }) => {
  try {
    const text = args.join(" ");
    if (!text) {
      return reply("❗️ Please provide a question.");
    }

    // API URL
    const apiUrl = `https://manul-ofc-tech-api-1e5585f5ebef.herokuapp.com/fluxai?prompt=${encodeURIComponent(text)}`;

    // React to the message
    await conn.sendMessage(msg.key.remoteJid, { react: { text: "🤖", key: msg.key } });

    // API request
    const response = await axios.get(apiUrl);

    // Check if API response is valid
    if (!response.data || !response.data.reply) {
      return reply("❌ Error: No response from AI.");
    }

    const aiResponse = response.data.reply;
    await reply(aiResponse);

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    reply("❌ Error fetching AI response.");
  }
});
