const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "quran",
    desc: "Receive a blessed Quranic verse",
    category: "religion",
    react: "📖",
    filename: __filename
},
async (conn, mek, m, {
    from,
    args,
    reply
}) => {
    try {
        let surah = args.join(" ").trim();

        if (!surah || isNaN(surah)) {
            return reply("🕌 Please provide a valid Surah number (e.g., `.quran 1` for Al-Fatiha).");
        }

        let url = `https://api.davidcyriltech.my.id/quran?surah=${encodeURIComponent(surah)}`;
        let res = await fetchJson(url);

        if (!res || !res.success || !res.surah) {
            return reply("😔 Sorry, no Quranic verse was found. Please try again.");
        }

        let { number, name, type, ayahCount, tafsir, recitation } = res.surah;

        let message = `📖 *Holy Quran - Surah ${number}: ${name.english} (${name.arabic})* 📖\n\n` +
                      `🔹 *Type:* ${type}\n` +
                      `📜 *Total Ayahs:* ${ayahCount}\n\n` +
                      `📖 *Tafsir (Explanation in Indonesian):*\n_${tafsir.id}_\n\n` +
                      `🎧 *Recitation:* [Click to Listen](${recitation})\n\n` +
                      `✨ May this verse bring peace and guidance. Ameen. 🕌`;

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

        // Send the blessed message
        await conn.sendMessage(
            from,
            { text: message, contextInfo: newsletterContext },
            { quoted: mek }
        );
    } catch (e) {
        console.error("Error in Quran Command:", e);
        return reply(`⚠️ Error: ${e.message || e}\n\n🕌 Please try again later.`);
    }
});
