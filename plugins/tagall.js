const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "tagall",
    react: "🏷️",
    desc: "Tag all group members",
    category: "group",
    filename: __filename,
    use: ".tagall [message]"
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, isBotAdmins, isAdmins, groupMetadata, participants, reply }) => {
    try {
        // Newsletter context info
        const _0x273817 = {
            'mentionedJid': participants.map(p => p.id),
            'forwardingScore': 0x3e7,
            'isForwarded': true,
            'forwardedNewsletterMessageInfo': {
                'newsletterJid': '120363292876277898@newsletter',
                'newsletterName': "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
                'serverMessageId': 0x8f
            }
        };

        if (!isGroup) return reply("📛 *THIS COMMAND CAN ONLY BE USED IN GROUPS*");
        if (!isBotAdmins) return reply("📛 *BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
        if (!isAdmins) return reply("📛 *YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

        // Prepare the message
        let message = `乂 *Attention Everyone* 乂\n\n`;
        message += `*Message:* ${q || 'No message provided'}\n\n`;
        message += `*Requested by:* @${sender.split('@')[0]}\n\n`;
        message += participants.map(p => `❒ @${p.id.split('@')[0]}`).join('\n');

        // Send the message with mentions and newsletter context
        await conn.sendMessage(
            from,
            {
                text: message,
                mentions: participants.map(p => p.id),
                contextInfo: _0x273817
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("TagAll Error:", error);
        reply("❌ An error occurred while processing the command.");
    }
});