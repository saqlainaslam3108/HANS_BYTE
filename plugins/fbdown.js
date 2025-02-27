const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "facebook",
    alias: ["fb", "fbvid"],
    react: '📥',
    category: "download",
    desc: "Download HD Facebook videos with watermark",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        // Check if the URL is valid and contains 'facebook.com'
        if (!q || !q.includes('facebook.com')) return await reply('*Please provide a valid Facebook video URL!*');

        console.log('Requesting Facebook video from URL:', q);

        // API endpoint for downloading Facebook video
        const apiUrl = `https://dark-shan-yt.koyeb.app/download/facebook?url=${encodeURIComponent(q)}`;
        const response = await fetchJson(apiUrl);

        // Log API response for debugging purposes
        console.log('API Response:', response);

        // Check if response is valid
        if (!response.status || !response.data || !response.data.results) {
            await conn.sendMessage(from, {
                image: { url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(10).jpeg" },
                caption: "*Failed to fetch the video. Please try again!*"
            }, { quoted: mek });
            return;
        }

        const videoData = response.data;
        const videoLinks = videoData.results;

        // Filter only HD video (720p)
        const hdVideo = videoLinks.find(v => v.quality === 720);
        if (!hdVideo) {
            await conn.sendMessage(from, {
                image: { url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(10).jpeg" },
                caption: "*HD video not available for this link!*"
            }, { quoted: mek });
            return;
        }

        // Send preview image with watermark
        await conn.sendMessage(m.chat, {
            image: { url: videoData.preview },
            caption: `🎬 *Facebook HD Video*\n\n© 𝗩𝗢𝗥𝗧𝗘𝗫 𝗠𝗗`
        }, { quoted: mek });

        // Send reaction to indicate download is in progress
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        // Send the HD video with watermark
        console.log('Sending video:', hdVideo.url);  // Log video URL being sent
        await conn.sendMessage(from, {
            video: { url: hdVideo.url },
            mimetype: 'video/mp4',
            caption: `🎬 *Here is your HD video!*\n\n© 𝗩𝗢𝗥𝗧𝗘𝗫 𝗠𝗗`
        }, { quoted: mek });

        // Send confirmation after video is sent
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        // Log the error for debugging
        console.error("Main Error:", error);

        // Send error image with a message
        await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(10).jpeg" },
            caption: "*An error occurred while fetching the video. Please try again later!*"
        }, { quoted: mek });
    }
});
