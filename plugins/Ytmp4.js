const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { promisify } = require('util');
const path = require('path');
const pipeline = promisify(require('stream').pipeline);

// Configure paths
ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH || 'ffmpeg');
const tempDir = path.join(__dirname, '../temp');

// Newsletter context configuration
const newsletterContext = {
    mentionedJid: [], // Can add specific JIDs if needed
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363292876277898@newsletter',
        newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
        serverMessageId: 143,
    }
};


cmd({
    pattern: "video",
    alias: ['ytdl', 'youtube'],
    react: "🎥",
    desc: "Download video from YouTube",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    const retryLimit = 3; // Maximum number of retries
    let attempt = 0;

    // Retry function
    const fetchVideo = async () => {
        try {
            if (!q) return reply("*❌ Please provide a video title or YouTube URL*");

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
│ *🎥 Video Downloader*
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

            // Get video URL
            const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`);
            const videoData = await apiResponse.json();

            if (!videoData.success || !videoData.result?.download_url) {
                return reply("*❌ Failed to get video download link*");
            }

            // Send video with newsletter context
            await conn.sendMessage(from, {
                video: { url: videoData.result.download_url },
                mimetype: 'video/mp4',
                caption: "*🎥 HANS BYTE MD*",
                contextInfo: messageContext
            }, { quoted: mek });

            // Send as document
            await conn.sendMessage(from, {
                document: { url: videoData.result.download_url },
                mimetype: 'video/mp4',
                fileName: `${video.title}.mp4`,
                caption: "*📁 HANS BYTE MD*",
                contextInfo: messageContext
            }, { quoted: mek });

        } catch (error) {
            console.error('Video Error:', error);
            attempt++;

            if (attempt < retryLimit) {
                console.log(`Retrying... Attempt ${attempt + 1}`);
                await fetchVideo(); // Retry on failure
            } else {
                reply(`*❌ Error:* ${error.message}`);
            }
        }
    };

    // Call the fetchVideo function for the first time
    await fetchVideo();
});

cmd({
    pattern: "ytmp4",
    alias: ['youtube', 'ytvid'],
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


