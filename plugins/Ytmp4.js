const { cmd, commands } = require("../command");
const axios = require("axios");
const yts = require("yt-search");

cmd({
    pattern: "ytmp4",
    react: '📽️',
    alias: ["video", "playvid"],
    desc: "Download video from YouTube",
    category: "media",
    filename: __filename
},
async(robin, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        if (!q) return reply("Please provide a YouTube URL or search query");

        // Check if input is YouTube URL or search query
        const isYoutubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(q);
        let videoUrl, videoInfo;

        if (isYoutubeUrl) {
            videoUrl = q;
            await reply("📥 Processing YouTube URL...");
            
            // Get video info directly from URL
            const searchResults = await yts({ videoId: videoUrl.split(/v=|\//).pop().split("&")[0] });
            videoInfo = {
                title: searchResults.title,
                url: videoUrl,
                thumbnail: searchResults.thumbnail,
                views: searchResults.views,
                duration: searchResults.duration.timestamp,
                uploaded: searchResults.ago,
                channel: searchResults.author.name
            };
        } else {
            await reply("🔍 Searching YouTube...");
            const searchResults = await yts(q);
            if (!searchResults.videos.length) return reply("❌ No results found");
            
            const video = searchResults.videos[0];
            videoUrl = video.url;
            videoInfo = {
                title: video.title,
                url: video.url,
                thumbnail: video.thumbnail,
                views: video.views,
                duration: video.duration.timestamp,
                uploaded: video.ago,
                channel: video.author.name
            };
        }

        // Fetch video download link
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.success || !response.data.result?.download_url) {
            return reply("❌ Failed to fetch video download link");
        }

        const { title, download_url } = response.data.result;

        // Prepare info message
        const infoMessage = `
╔══════════════════╗
   🎥 𝗩𝗜𝗗𝗘𝗢 𝗜𝗡𝗙𝗢
╚══════════════════╝

📌 𝗧𝗜𝗧𝗟𝗘: ${videoInfo.title}

⏳ 𝗗𝗨𝗥𝗔𝗧𝗜𝗢𝗡: ${videoInfo.duration}
👀 𝗩𝗜𝗘𝗪𝗦: ${videoInfo.views.toLocaleString()}
📅 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗗: ${videoInfo.uploaded}
📺 𝗖𝗛𝗔𝗡𝗡𝗘𝗟: ${videoInfo.channel}

🔗 𝗟𝗜𝗡𝗞: ${videoInfo.url}

╔══════════════════╗
  ✦ 𝗛𝗮𝗻𝘀 𝗕𝘆𝘁𝗲 𝗠𝗗 ✦
╚══════════════════╝
        `.trim();

        // Send thumbnail with video info
        await robin.sendMessage(
            from,
            {
                image: { url: videoInfo.thumbnail },
                caption: infoMessage
            },
            { quoted: mek }
        );

        // Send video file
        await robin.sendMessage(
            from,
            {
                video: { url: download_url },
                mimetype: "video/mp4",
                caption: `📥 ${title}`,
                fileName: `${title}.mp4`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("YTMP4 Error:", error);
        reply("❌ Error processing request. Please try again later.");
    }
});