module.exports = {
    name: "ping",
    alias: ["pong"],
    category: "utility",
    desc: "Check bot response time",
    async execute(m, { conn, reply }) {
        try {
            const start = Date.now();

            // React with a ping emoji
            await conn.sendMessage(m.key.remoteJid, { react: { text: "🏓", key: m.key } });

            // Send initial response
            const sentMsg = await reply("🏓 Pinging...");

            const end = Date.now();
            const pingTime = end - start;

            // Edit the message with final response time
            await conn.sendMessage(m.key.remoteJid, { text: `🏓 Pong! Response Time: ${pingTime}ms`, edit: sentMsg.key });

        } catch (error) {
            console.error("Error in ping command:", error);
            reply("❌ Error checking ping.");
        }
    }
};
