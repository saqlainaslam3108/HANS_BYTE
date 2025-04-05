const { cmd } = require('../command'); // Ensure the path is correct
const fetch = require('node-fetch');

cmd({
    pattern: "qr",
    alias: ["qrcode"],
    react: "📲",
    desc: "Generate a QR code from text",
    category: "tools",
    use: '.qr <text>',
    filename: __filename
},
async (conn, mek, m, { from, reply, q, sender }) => {
    if (!q || !q.trim()) {
        return await reply("Please provide text to generate a QR code!");
    }
    
    try {
        const apiUrl = `https://apis.davidcyriltech.my.id/tools/qrcode?text=${encodeURIComponent(q)}`;
        
        // Newsletter context info
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363292876277898@newsletter',
                newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
                serverMessageId: 143,
            },
        };
        
        await conn.sendMessage(from, { image: { url: apiUrl }, caption: `QR Code for: ${q}`, contextInfo: newsletterContext }, { quoted: mek });
        
    } catch (error) {
        console.error(error);
        reply('An error occurred while generating the QR code. Please try again later.');
    }
});
