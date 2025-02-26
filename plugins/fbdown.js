const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "facebook",
    alias: ["fb", "fbvid"],
    react: '📥',
    category: "download",
    desc: "Download Facebook videos using API",
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

        let resultMsg = `🎬 *Facebook Video Download* 🎬\n\n📌 *Caption:* ${videoData.caption || 'No caption'}\n\n`;
        videoLinks.forEach((video, index) => {
            resultMsg += `🎥 *Quality:* ${video.quality}p (${video.type})\n🔗 *Download Link:* ${video.url}\n\n`;
        });

        await conn.sendMessage(m.chat, {
            image: { url: videoData.preview },
            caption: resultMsg
        }, { quoted: mek });

        // Default send highest quality video
        const bestQualityVideo = videoLinks[0];
        if (bestQualityVideo) {
            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

            await conn.sendMessage(from, {
                video: { url: bestQualityVideo.url },
                mimetype: 'video/mp4',
                caption: `🎬 *Here is your video!*`
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        }

    } catch (error) {
        console.error(error);
        await reply('*An error occurred while fetching the video. Please try again later!*');
    }
});
