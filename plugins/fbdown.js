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
        if (!q || !q.includes('facebook.com')) return await reply('*Please provide a valid Facebook video URL!*');

        const apiUrl = `https://dark-shan-yt.koyeb.app/download/facebook?url=${encodeURIComponent(q)}`;
        const response = await fetchJson(apiUrl);

        if (!response.status || !response.data || !response.data.results) {
            return await reply('*Failed to fetch the video. Please try again!*');
        }

        const videoData = response.data;
        const videoLinks = videoData.results;
        
        // Filter only HD video (720p)
        const hdVideo = videoLinks.find(v => v.quality === 720);
        if (!hdVideo) return await reply('*HD video not available for this link!*');

        await conn.sendMessage(m.chat, {
            image: { url: videoData.preview },
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
        console.error(error);
        await reply('*An error occurred while fetching the video. Please try again later!*');
    }
});
