const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');

// Newsletter context config
const newsletterContext = {
    mentionedJid: [],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363292876277898@newsletter',
        newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
        serverMessageId: 143,
    }
};

cmd({
    pattern: "play",
    alias: ['ytmp3', 'song'],
    react: "🎵",
    desc: "Download audio from YouTube",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    if (!q) return reply("*❌ Please provide a song title or YouTube URL*");

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╭════════════⊷❍
│
│ *🎵 Audio Downloader*
│──────────────────────
│ 📌 Title: ${video.title}
│ 👤 Channel: ${video.author.name}
│ ⏱️ Duration: ${video.timestamp}
│ 📊 Views: ${video.views}
╰──────────●●►
*📥 Downloaded via HANS BYTE MD*`.trim();

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // Update API URL
        const api = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(q)}`;
        const res = await fetch(api);
        const json = await res.json();

        if (!json.status || json.status !== true || !json.result?.download_url) {
            return reply("*❌ Failed to get audio download link*");
        }

        // Send MP3 as audio message
        await conn.sendMessage(from, {
            audio: { url: json.result.download_url },
            mimetype: 'audio/mp4',
            fileName: `${json.result.title}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });

        // Send as document too
        await conn.sendMessage(from, {
            document: { url: json.result.download_url },
            mimetype: 'audio/mp4',
            fileName: `${json.result.title}.mp3`,
            caption: "*📁 HANS BYTE MD*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("Audio Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});
// Command to download audio from YouTube URL

cmd({
    pattern: "ytmp3",
    alias: ['yturlmp3'],
    react: "🎧",
    desc: "Download audio from a YouTube URL",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    if (!q || !q.includes("youtube.com/watch?v=")) {
        return reply("*❌ Please provide a valid YouTube video URL*");
    }

    try {
        const api = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(q)}`;
        const res = await fetch(api);
        const json = await res.json();

        if (!json.success || !json.result?.download_url) {
            return reply("*❌ Failed to retrieve MP3 link*");
        }

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╭════════════⊷❍
│
│ *🎶 YT Audio Downloader*
│──────────────────────
│ 📌 Title: ${json.result.title}
│ 🎧 Quality: ${json.result.quality}
│ 📁 Type: ${json.result.type}
╰──────────●●►
*📥 Powered by HANS BYTE MD*`.trim();

        await conn.sendMessage(from, {
            image: { url: json.result.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // Send as audio
        await conn.sendMessage(from, {
            audio: { url: json.result.download_url },
            mimetype: 'audio/mp4',
            fileName: `${json.result.title}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });

        // Optional: send as document
        await conn.sendMessage(from, {
            document: { url: json.result.download_url },
            mimetype: 'audio/mp4',
            fileName: `${json.result.title}.mp3`,
            caption: "*📁 HANS BYTE MD*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("YTMP3 Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});



cmd({
    pattern: "yts",
    alias: ['ytsearch'],
    react: "🎧",
    desc: "Search YouTube for a video",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    if (!q) return reply("*❌ Please provide a song title or keywords for search*");

    try {
        // Search YouTube using yt-search
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        // Prepare message context
        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╭════════════⊷❍
│
│ *🎶 YouTube Search Result*
│──────────────────────
│ 📌 Title: ${video.title}
│ 👤 Channel: ${video.author.name}
│ ⏱️ Duration: ${video.timestamp}
│ 📊 Views: ${video.views}
│ 🔗 Link: ${video.url}
╰──────────●●►
*🔍 Search powered by HANS BYTE MD*`.trim();

        // Send the search result details back to the user
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("YTB Search Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});
