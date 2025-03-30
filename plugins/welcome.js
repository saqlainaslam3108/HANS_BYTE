const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "welcome",
    react: "👋",
    desc: "Toggle welcome messages",
    category: "group",
    filename: __filename,
    use: ".welcome on/off"
}, async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ Group only command");
        if (!isBotAdmins) return reply("❌ Bot needs admin");
        if (!isAdmins) return reply("❌ You need admin");

        if (q === "on") {
            config.WELCOME = true;
            reply("✅ Welcome messages enabled");
        } else if (q === "off") {
            config.WELCOME = false;
            reply("✅ Welcome messages disabled");
        } else {
            reply("Usage: .welcome on/off");
        }
    } catch (e) {
        console.error(e);
        reply("❌ Error toggling welcome");
    }
});