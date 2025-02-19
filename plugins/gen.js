const axios = require("axios");

module.exports = {
  name: "gen",
  alias: ["ai"],
  category: "AI",
  desc: "Generate AI responses using FluxAI API",
  async exec(msg, sock, args) {
    try {
      if (!args.length) {
        return msg.reply("⚠️ Usage: .gen <prompt>");
      }

      const prompt = args.join(" ");
      const apiUrl = `https://manul-ofc-tech-api-1e5585f5ebef.herokuapp.com/fluxai?prompt=${encodeURIComponent(prompt)}`;

      // API call
      const response = await axios.get(apiUrl);
      const aiReply = response.data.reply || "⚠️ No response from AI.";

      // Send AI response
      await sock.sendMessage(msg.from, { text: aiReply }, { quoted: msg });

    } catch (error) {
      console.error(error);
      msg.reply("❌ Error fetching AI response.");
    }
  },
};
