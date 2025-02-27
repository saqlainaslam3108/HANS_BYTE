const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const domain = `https://mr-manul-ofc-apis.vercel.app`;
const api_key = `Manul-Official-Key-3467`; // Use the correct API key

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

        // Fetch the API response again for each new request
        const response = await fetchJson(`${domain}/facebook-dl?apikey=${api_key}&facebookUrl=${encodeURIComponent(q)}`);
        console.log("API Response:", response);  // Debugging log

        if (response.error) {
            return await reply(`Error: ${response.error}`);
        }

        const urls = response.data?.urls;
        if (!urls || urls.length === 0) {
            return await reply('Sorry, no download links available for this video.');
        }

        // Extract the first URL from the response
        const videoLink = urls[0]?.url;

        if (!videoLink) {
            return await reply('Sorry, unable to fetch the download link for this video.');
        }

        // Send the video directly from the API response with watermark
        await conn.sendMessage(from, {
            video: { url: videoLink },
            caption: `🎥 *Facebook Video Download*\n\n> ⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚`,
            mentions: [from], // This sends the watermark in the caption.
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

    } catch (error) {
        console.error('Error in fbvideo command:', error);
        await reply('Sorry, something went wrong. Please try again later.');
    }
});🤌🤌
