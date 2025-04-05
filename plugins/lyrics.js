const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "lyrics",
    react: "🎵",
    desc: "Search song lyrics",
    category: "music",
    filename: __filename
}, 
async (conn, mek, m, { from, args }) => {
    try {
        if (args.length < 2) {
            return await conn.sendMessage(from, { text: "Usage: *!lyrics [song] | [artist]*\nExample: !lyrics Faded | Alan Walker" }, { quoted: mek });
        }

        // Split input based on '|'
        const input = args.join(" ").split("|").map(i => i.trim());

        if (input.length < 2) {
            return await conn.sendMessage(from, { text: "❌ Invalid format. Use: *!lyrics [song] | [artist]*" }, { quoted: mek });
        }

        const songTitle = input[0];
        const artistName = input[1];

        console.log(`[INFO] Searching lyrics for: ${songTitle} | ${artistName}`);

        const apiUrl = `https://apis.davidcyriltech.my.id/lyrics2?t=${encodeURIComponent(songTitle)}&a=${encodeURIComponent(artistName)}`;
        const response = await axios.get(apiUrl);
        const { title, artist, lyrics } = response.data;

        if (!lyrics) {
            return await conn.sendMessage(from, { text: `❌ No lyrics found for *${songTitle} | ${artistName}*.` }, { quoted: mek });
        }

        // Format response with "Song | Artist"
        const lyricsMessage = `🎶 *${title} | ${artist}*\n\n${lyrics}`;

        console.log("[SUCCESS] Lyrics found. Sending message...");

        await conn.sendMessage(from, {
            text: lyricsMessage,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363292876277898@newsletter',
                    newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        console.log("[SUCCESS] Lyrics sent successfully via newsletter.");

    } catch (error) {
        console.error("[ERROR] Failed to fetch lyrics:", error.message);
        await conn.sendMessage(from, { text: `❌ Error fetching lyrics: ${error.message}` }, { quoted: mek });
    }
});
