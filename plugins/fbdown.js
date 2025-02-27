const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "facebook",
    alias: ["fb", "fbvid"],
    react: '📥',
    category: "download",
    desc: "Download HD or SD Facebook videos",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q || !q.includes('facebook.com')) return await reply('*Please provide a valid Facebook video URL!*');

        const apiUrl = `https://dark-shan-yt.koyeb.app/download/facebook?url=${encodeURIComponent(q)}`;
        const response = await fetchJson(apiUrl);

        if (!response.status || !response.data || !response.data.results) {
            return await reply('*Failed to fetch the video. Please try again!*');
        }

        const videoData = response.data;
        const videoLinks = videoData.results;
        
        const hdVideo = videoLinks.find(v => v.quality === 720);
        const sdVideo = videoLinks.find(v => v.quality < 720);

        if (!hdVideo && !sdVideo) return await reply('*No downloadable video found for this link!*');

        let videoOptions = `🎬 *Facebook Video Found!*\n\n`;
        if (hdVideo) videoOptions += `1️⃣ HD (720p)\n`;
        if (sdVideo) videoOptions += `2️⃣ SD (${sdVideo.quality}p)\n`;
        videoOptions += `\n📌 *Reply with 1 or 2 to choose a quality.*`;

        const sentMsg = await conn.sendMessage(m.chat, {
            image: { url: videoData.preview },
            caption: videoOptions
        }, { quoted: mek });

        // Store the sent message ID and corresponding video details
        global.fbVideoRequests = global.fbVideoRequests || {};
        global.fbVideoRequests[sentMsg.key.id] = { hdVideo, sdVideo, from };

    } catch (error) {
        console.error("Main Function Error:", error);
        await reply('*An error occurred while fetching the video. Please try again later!*');
    }
});

// Global Event Listener - Handles all responses to Facebook video requests
conn.ev.on('messages.upsert', async (update) => {
    try {
        const userReply = update.messages[0];
        if (!userReply.message) return;
        const textReply = userReply.message.conversation || userReply.message.extendedTextMessage?.text;
        const replyToMsgId = userReply.message.extendedTextMessage?.contextInfo?.stanzaId;

        if (!replyToMsgId || !global.fbVideoRequests || !global.fbVideoRequests[replyToMsgId]) return;

        const { hdVideo, sdVideo, from } = global.fbVideoRequests[replyToMsgId];

        let selectedVideo;
        if (textReply.trim() === '1' && hdVideo) {
            selectedVideo = hdVideo;
        } else if (textReply.trim() === '2' && sdVideo) {
            selectedVideo = sdVideo;
        } else {
            return await conn.sendMessage(from, { text: '*Invalid choice! Please reply with 1 for HD or 2 for SD.*', quoted: userReply });
        }

        await conn.sendMessage(from, { react: { text: '⬇️', key: userReply.key } });

        await conn.sendMessage(from, {
            video: { url: selectedVideo.url },
            mimetype: 'video/mp4',
            caption: `🎬 *Here is your ${selectedVideo.quality}p video!*`
        }, { quoted: userReply });

        await conn.sendMessage(from, { react: { text: '✅', key: userReply.key } });

        // Remove processed request
        delete global.fbVideoRequests[replyToMsgId];

    } catch (error) {
        console.error("Reply Handling Error:", error);
    }
});
