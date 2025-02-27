/*
Please Give Credit 🙂❤️
⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚
*/

const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const domain = `https://mr-manul-ofc-apis.vercel.app`;
const api_key = `Manul-Official-Key-3467`; // Corrected API key

//============================================

cmd({
    pattern: "fbvideo",
    alias: ["facebookvideo", "fbvd"],
    react: '📹',
    category: "download",
    desc: "Download Facebook video using provided URL",
    filename: __filename
}, async (conn, m, mek, { from, isMe, isOwner, q, reply }) => {
    try {
        // Check if Facebook URL is provided
        if (!q || !q.trim().includes('facebook.com')) {
            return await reply('*Please provide a valid Facebook video URL!*');
        }

        // Call the API to fetch the download link
        const response = await fetchJson(`${domain}/facebook-dl?apikey=${api_key}&facebookUrl=${encodeURIComponent(q)}`);

        if (response.error) {
            return await reply(`Error: ${response.error}`);
        }

        const videoLink = response.link;
        if (!videoLink) {
            return await reply('Sorry, unable to fetch the download link for this video.');
        }

        // Send the download link to the user
        await conn.sendMessage(from, {
            text: `🎥 *Facebook Video Download Link:*\n\n🔗 ${videoLink}\n\n> ⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

    } catch (error) {
        console.error('Error in fbvideo command:', error);
        await reply('Sorry, something went wrong. Please try again later.');
    }
});

//============= VORTEX MD | Pansilu Nethmina 💚 ==========
