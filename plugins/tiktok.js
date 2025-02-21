const axios = require('axios');
const { cmd } = require('your-command-library'); // Replace with the actual command library you're using

const domain = "http://your-api-domain.com"; // Replace with your actual API domain

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tiktokdl"],
    react: "🎥",
    category: "download",
    desc: "Download TikTok videos with watermark",
    filename: __filename
}, async (conn, m, mek, { args, reply }) => {
    try {
        if (!args[0]) return await reply("❌ Please provide a TikTok video link!");

        const apiUrl = `${domain}/scrape-tiktok?url=${encodeURIComponent(args[0])}&apikey=Manul-Official-Key-3467`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.status === 'success') {
            const videoUrl = response.data.data.watermark; // URL with watermark
            await conn.sendMessage(m.chat, {
                video: { url: videoUrl },
                caption: "✅ Here is your TikTok video!"
            }, { quoted: mek });
        } else {
            await reply("❌ Failed to fetch the video. Please try again later!");
        }
    } catch (error) {
        console.error("TikTok API Error:", error);
        await reply("❌ Error fetching TikTok video!");
    }
});
