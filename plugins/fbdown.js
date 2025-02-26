const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "facebook",
    alias: ["fb", "fbvid"],
    react: '📥',
    category: "download",
    desc: "Download HD/SD Facebook videos",
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
        const sdVideo = videoLinks.find(v => v.quality === 360);

        if (!hdVideo && !sdVideo) return await reply('*No available video quality for this link!*');

        let caption = `🎬 *Facebook Video Found!*\n\n`;
        if (sdVideo) caption += `📹 *SD (360p)* → Reply *1* to download.\n`;
        if (hdVideo) caption += `🎥 *HD (720p)* → Reply *2* to download.\n`;

        await conn.sendMessage(from, {
            image: { url: videoData.preview },
            caption
        }, { quoted: mek });

        conn.fb_videos = conn.fb_videos || {};
        conn.fb_videos[m.key.id] = { hd: hdVideo?.url, sd: sdVideo?.url, from, mek };

    } catch (error) {
        console.error(error);
        await reply('*An error occurred while fetching the video. Please try again later!*');
    }
});

cmd({
    on: "text"
}, async (conn, m, mek) => {
    if (!conn.fb_videos || !conn.fb_videos[m.quoted?.key?.id]) return;
    
    const videoData = conn.fb_videos[m.quoted.key.id];
    const { hd, sd, from, mek: originalMek } = videoData;

    let selectedVideo;
    if (m.body.trim() === "1" && sd) selectedVideo = { url: sd, quality: "SD" };
    if (m.body.trim() === "2" && hd) selectedVideo = { url: hd, quality: "HD" };

    if (!selectedVideo) return await conn.sendMessage(from, { text: "*Invalid option! Reply with 1 for SD or 2 for HD.*" }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

    await conn.sendMessage(from, {
        video: { url: selectedVideo.url },
        mimetype: 'video/mp4',
        caption: `🎬 *Here is your ${selectedVideo.quality} video!*`
    }, { quoted: originalMek });

    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    delete conn.fb_videos[m.quoted.key.id]; // Clear data after sending
});
