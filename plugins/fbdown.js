const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const fbApi = `https://dark-shan-yt.koyeb.app/download/facebook?url=`;

/*
⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚
*/

cmd({
    pattern: "fb",
    alias: ["facebook", "fbvid"],
    react: '📥',
    category: "download",
    desc: "Download Facebook videos",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q || !q.includes("facebook.com")) {
            return await reply('*Please provide a valid Facebook video URL!*');
        }

        await reply('🔄 *Downloading video...*');
        const videoData = await fetchJson(`${fbApi}${encodeURIComponent(q)}`);

        if (!videoData || !videoData.url) {
            return await reply('*Failed to fetch the video. Please try again!*');
        }

        const videoUrl = videoData.url;
        const caption = `🎥 *Facebook Video Downloaded*\n\n🔗 *Source:* [Click Here](${q})\n⚖️ *Powered By - : VORTEX MD | Pansilu Nethmina 💚*`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption
        }, { quoted: mek });

    } catch (error) {
        console.error('Error in fb command:', error);
        await reply('❌ *Error occurred while downloading the video. Please try again later!*');
    }
});
