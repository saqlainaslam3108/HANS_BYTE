/*
Please Give Credit 🙂❤️
⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚
*/

const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const domain = `https://mr-manul-ofc-apis.vercel.app`;
const api_key = `Manul-Official-Key-3467`;

//===== Api-Key එක මට Message එකක් දාල ඉල්ලගන්න, +94 74 227 4855 සල්ලි ගන්න නෙවේ, කීයක් Use කරනවද දැනගන්න...❤️=====

//============================================

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tiktokdl"],
    react: '📲',
    category: "download",
    desc: "Download TikTok videos with or without watermark",
    filename: __filename
}, async (conn, m, mek, { from, isMe, isOwner, q, reply }) => {
    try {
        // Check if search query (TikTok video URL) is provided
        if (!q || q.trim() === '') return await reply('*Please provide a TikTok video URL!*');

        // Check if only the bot number is allowed for downloads (Optional based on your setup)
        if (!isMe && !isOwner) return await reply('*Only Bot Number Can Download Videos !!!*');

        // Fetch TikTok video details from the API using the provided URL
        const tiktokData = await fetchJson(`${domain}/api/tiktok-download?url=${encodeURIComponent(q)}&apikey=${api_key}`);
        
        console.log('API Response:', tiktokData); // Log the response for debugging
        
        // Handle API response
        if (tiktokData.error) {
            return await reply(`Sorry, could not fetch video details. Error: ${tiktokData.error}`);
        }

        const videoData = tiktokData.data;

        // Check if video data is returned
        if (!videoData || !videoData.videoUrl) {
            return await reply('No video found for this link!');
        }

        const downloadLink = videoData.videoUrl;
        const videoTitle = videoData.title || 'TikTok Video';

        // Send the video with a caption
        await conn.sendMessage(m.chat, {
            video: { url: downloadLink },
            caption: `${videoTitle}\n\n> ⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error('Error in tiktok command:', error);
        await reply('Sorry, something went wrong. Please try again later.');
    }
});
