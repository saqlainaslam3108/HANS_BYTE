/*
Please Give Credit 🙂❤️
⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚
*/

const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "fbdown",
    alias: ["facebookdl", "fbdl"],
    react: '⬇️',
    category: "download",
    desc: "Download Facebook videos in HD",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("*Please provide a Facebook video URL.*");

        const apiUrl = `https://dark-shan-yt.koyeb.app/download/facebook?url=${encodeURIComponent(q)}`;
        const response = await fetchJson(apiUrl);

        if (response.status && response.video && response.video.length > 0) {
            const hdVideo = response.video.find(video => video.quality === 'HD');

            if (hdVideo && hdVideo.url) {
                await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

                await conn.sendMessage(from, {
                    video: { url: hdVideo.url },
                    caption: `*Facebook Video Downloaded (HD)*\n\n> ⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚`
                }, { quoted: mek });

                await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
            } else {
                // HD video not found, try to send the best quality available
                const bestVideo = response.video[0]; // Assuming the first one is the best
                if (bestVideo && bestVideo.url) {
                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

                    await conn.sendMessage(from, {
                        video: { url: bestVideo.url },
                        caption: `*Facebook Video Downloaded (Best Quality Available)*\n\n> ⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚`
                    }, { quoted: mek });
                    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
                } else {
                    await reply("*Could not find any downloadable video.*");
                }
            }
        } else {
            await reply("*Invalid Facebook video URL or video not found.*");
        }
    } catch (error) {
        console.error("Error in fbdown command:", error);
        await reply("*An error occurred while processing your request. Please try again later.*");
    }
});
