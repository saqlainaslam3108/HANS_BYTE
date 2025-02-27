const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "facebook",
    alias: ["fb", "fbvid"],
    react: '📥',
    category: "download",
    desc: "Download HD Facebook videos",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q || !q.includes('facebook.com')) {
            return await reply('*Please provide a valid Facebook video URL!*');
        }

        const apiUrl = `https://api.ryzendesu.vip/api/downloader/fbdl?url=${encodeURIComponent(q)}`;
        console.log("API URL:", apiUrl); // Log API URL

        const response = await fetchJson(apiUrl);
        console.log("API Response:", response); // Log API response

        // Error handling if response is invalid
        if (!response || !response.status || !response.result || !response.result.sd || !response.result.hd) {
            console.error("Error: No valid video data found in response.");
            return await reply('*Failed to fetch the video. Please try again!*');
        }

        const videoData = response.result;
        const hdVideoUrl = videoData.hd || videoData.sd; // Get HD video or fallback to SD
        if (!hdVideoUrl) {
            console.error("Error: No video URL found.");
            return await reply('*No video available for this link!*');
        }

        const previewImage = videoData.thumbnail || 'https://example.com/fallback_image.jpg'; // Fallback image URL

        await conn.sendMessage(m.chat, {
            image: { url: previewImage },
            caption: `🎬 *Facebook HD Video*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: hdVideoUrl },
            mimetype: 'video/mp4',
            caption: `🎬 *Here is your HD video!*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error("Caught Error:", error); // Log the error
        await reply('*An error occurred while fetching the video. Please try again later!*');
    }
});
