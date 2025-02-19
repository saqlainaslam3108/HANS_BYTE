module.exports = {
  name: "ping",
  alias: ["pong"],
  category: "utility",
  desc: "Check bot response time",
  async execute(m, { conn, reply }) {
    try {
      const start = Date.now();
      
      // React with "🏓"
      await conn.sendMessage(m.key.remoteJid, { react: { text: "🏓", key: m.key } });
      
      // Send initial "Pinging..." message
      const sentMsg = await reply("🏓 Pinging...");
      
      const end = Date.now();
      const pingTime = end - start;
      
      // Edit the message with the response time
      await conn.sendMessage(
        m.key.remoteJid, 
        { text: `🏓 Pong! Response Time: ${pingTime}ms` }, 
        { quoted: sentMsg }
      );

    } catch (error) {
      console.error("Ping Command Error:", error);
      reply("❌ Error checking ping.");
    }
  }
};
