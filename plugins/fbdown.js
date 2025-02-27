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

        const apiUrl = `https://dark-shan-yt.koyeb.app/download/facebook?url=${encodeURIComponent(q)}`;
        console.log("API URL:", apiUrl); // Log the API URL

        const response = await fetchJson(apiUrl);
        console.log("API Response:", response); // Log the API Response

        // Error handling if response doesn't contain video data
        if (!response.status || !response.data || !response.data.results) {
            console.error("Error: No valid data found in response."); // Log error
            return await reply('*Failed to fetch the video. Please try again!*');
        }

        const videoData = response.data;
        const videoLinks = videoData.results;
        
        // Log the `results` to check what data is there
        console.log("Video Links (Results):", videoLinks);

        // Filter only HD video (720p) or fallback to first available video
        const hdVideo = videoLinks.find(v => v.quality === 720) || videoLinks[0];
        if (!hdVideo) {
            console.error("Error: No video found."); // Log error
            return await reply('*No video available for this link!*');
        }

        // Use the preview image or fallback image if not available
        const previewImage = videoData.preview || 'https://example.com/fallback_image.jpg'; // Replace with your fallback image URL

        await conn.sendMessage(m.chat, {
            image: { url: previewImage },
            caption: `🎬 *Facebook HD Video*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: hdVideo.url },
            mimetype: 'video/mp4',
            caption: `🎬 *Here is your HD video!*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error("Caught Error:", error); // Log the caught error
        await reply('*An error occurred while fetching the video. Please try again later!*');
    }
});
