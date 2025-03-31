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

//====== Song Command (YTMP3 via conversion) ======
cmd({
    pattern: "song",
    alias: ['play', 'ytmp3'],
    react: "🎵",
    desc: "Download audio from YouTube",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("*❌ Please provide a song title or YouTube URL*");
        
        // Search YouTube
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        // Prepare newsletter context
        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        // Send video info with newsletter context
        const infoMsg = `
╭════════════⊷❍
│
│ *🎵 MUSIC DOWNLOADER*
│──────────────────────
│ 📌 Title: ${video.title}
│ 👤 Artist: ${video.author.name}
│ ⏱️ Duration: ${video.timestamp}
│ 📊 Views: ${video.views}
╰──────────●●►
*🔊 Downloaded via HANS BYTE MD*`.trim();

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // Get video download URL
        const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`);
        const videoData = await apiResponse.json();
        
        if (!videoData.success || !videoData.result?.download_url) {
            return reply("*❌ Failed to get video download link*");
        }

        // Create temp files
        const tempVideo = path.join(tempDir, `${Date.now()}_video.mp4`);
        const tempAudio = path.join(tempDir, `${Date.now()}_audio.mp3`);

        // Download video
        const videoRes = await fetch(videoData.result.download_url);
        await pipeline(videoRes.body, fs.createWriteStream(tempVideo));

        // Convert to MP3
        await new Promise((resolve, reject) => {
            ffmpeg(tempVideo)
                .audioCodec('libmp3lame')
                .audioBitrate(128)
                .output(tempAudio)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });

        // Read converted audio
        const audioBuffer = fs.readFileSync(tempAudio);

        // Send audio with newsletter context
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            caption: "*🎵 HANS BYTE MD*",
            contextInfo: messageContext
        }, { quoted: mek });

        // Send as document with newsletter context
        await conn.sendMessage(from, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${video.title}.mp3`,
            caption: "*📁 HANS BYTE MD*",
            contextInfo: messageContext
        }, { quoted: mek });

        // Cleanup
        [tempVideo, tempAudio].forEach(file => {
            if (fs.existsSync(file)) fs.unlinkSync(file);
        });

    } catch (error) {
        console.error('Song Error:', error);
        reply(`*❌ Error:* ${error.message}`);
    }
});

//====== Video Command (YTMP4) ======
cmd({
    pattern: "video",
    alias: ['ytmp4', 'youtube'],
    react: "🎥",
    desc: "Download video from YouTube",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
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
        reply(`*❌ Error:* ${error.message}`);
    }
});