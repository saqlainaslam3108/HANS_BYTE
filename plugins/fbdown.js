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
        console.log("API URL:", apiUrl); // Debugging Log

        const response = await fetchJson(apiUrl).catch(err => {
            console.error("Error fetching data from API:", err);
            throw new Error('Failed to fetch data from the API');
        });
        
        console.log("API Response:", response); // Debugging Log

        // Validate API response
        if (!response || typeof response !== "object") {
            console.error("Error: Invalid API response.");
            return await reply('*Invalid API response. Please try again later!*');
        }

        if (response.status === false || !response.result) {
            console.error("Error: API response error or missing data.");
            return await reply('*API Error: Failed to fetch the video. Please try again later!*');
        }

        // Extract video data
        const videoData = response.result;
        const hdVideoUrl = videoData.hd || videoData.sd; // Get HD or fallback to SD
        if (!hdVideoUrl) {
            console.error("Error: No valid video URL found.");
            return await reply('*No video available for this link!*');
        }

        const previewImage = videoData.thumbnail || 'https://example.com/fallback_image.jpg'; // Default thumbnail

        // Send video preview
        await conn.sendMessage(m.chat, {
            image: { url: previewImage },
            caption: `🎬 *Facebook HD Video*`
        }, { quoted: mek });

        // React with download icon
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        // Send video file
        await conn.sendMessage(from, {
            video: { url: hdVideoUrl },
            mimetype: 'video/mp4',
            caption: `🎬 *Here is your HD video!*`
        }, { quoted: mek });

        // React with success icon
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error("Caught Error:", error); // Debugging Log
        await reply('*An error occurred while fetching the video. Please try again later!*');
    }
});
