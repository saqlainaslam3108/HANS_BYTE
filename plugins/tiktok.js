const axios = require("axios");

const domain = "https://mr-manul-ofc-apis.vercel.app";

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tiktokdl"],
    react: "🎥",
    category: "download",
    desc: "Download TikTok videos without watermark",
    filename: __filename
}, async (conn, m, mek, { args, reply }) => {
    try {
        if (!args[0]) return await reply("❌ Please provide a TikTok video link!");

        const apiUrl = `${domain}/scrape-tiktok?url=${encodeURIComponent(args[0])}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.video) {
            await conn.sendMessage(m.chat, {
                video: { url: response.data.video },
                caption: "✅ Here is your TikTok video! 🎥"
            }, { quoted: mek });
        } else {
            await reply("❌ Failed to fetch the video. Please try again later!");
        }
    } catch (error) {
        console.error("TikTok API Error:", error);
        await reply("❌ Error fetching TikTok video!");
    }
});
