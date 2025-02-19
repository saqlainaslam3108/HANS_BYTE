const axios = require("axios");

cmd({
  pattern: "gen",
  alias: ["imagine"],
  react: "💧",
  desc: "Generate AI responses using FluxAI API.",
  category: "ai",
  use: ".gen <Your Question>",
  filename: __filename
}, async (conn, mek, msg, { reply, args }) => {
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
    console.log(response.data); // 👈 Check API response

    // Check if API response contains the correct data
    if (response.data && (response.data.reply || response.data.result)) {
      const aiReply = response.data.reply || response.data.result;
      await reply(aiReply);
    } else {
      return reply("❌ API did not return a valid response.");
    }

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    reply("❌ Error fetching AI response.");
  }
});
