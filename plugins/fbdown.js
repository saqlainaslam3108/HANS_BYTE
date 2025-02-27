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
    if (!conn) {
        console.error("❌ Error: 'conn' is not defined.");
        return;
    }

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
