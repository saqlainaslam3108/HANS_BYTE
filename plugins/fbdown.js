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
    desc: "Download Facebook video with watermark",
    filename: __filename
}, async (conn, m, mek, { from, isMe, isOwner, q, reply }) => {
    try {
        // Check if Facebook URL is provided
        if (!q || !q.trim().includes('facebook.com')) {
            return await reply('*Please provide a valid Facebook video URL!*');
        }

        // Call the API to fetch the download link
        const response = await fetchJson(`${domain}/facebook-dl?apikey=${api_key}&facebookUrl=${encodeURIComponent(q)}`);

        console.log("API Response:", response);  // Debugging line to log the API response

        if (response.error) {
            return await reply(`Error: ${response.error}`);
        }

        const urls = response.data?.urls;
        if (!urls || urls.length === 0) {
            return await reply('Sorry, no download links available for this video.');
        }

        // Assuming the first URL in the array is the correct one
        const videoLink = urls[0]?.url;

        if (!videoLink) {
            return await reply('Sorry, unable to fetch the download link for this video.');
        }

        // Add watermark to the video link - Assuming the watermark functionality is integrated in the service
        const watermarkedVideoUrl = `${videoLink}&watermark=VORTEX_MD`; // Example: adding watermark via URL parameters

        // Send the video with the watermark applied
        await conn.sendMessage(from, {
            video: { url: watermarkedVideoUrl },
            caption: `🎥 *Facebook Video Download with Watermark*\n\n> ⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

    } catch (error) {
        console.error('Error in fbvideo command:', error);
        await reply('Sorry, something went wrong. Please try again later.');
    }
});

//============= VORTEX MD | Pansilu Nethmina 💚 ==========
