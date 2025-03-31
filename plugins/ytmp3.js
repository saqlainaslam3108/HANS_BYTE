/*const { cmd, commands } = require("../command");
const axios = require("axios");
const config = require("../config");
const yts = require("yt-search");

cmd({
    pattern: "play",
    react: '🎧',
    alias: ["song", "ytmp3"],
    desc: "Search and play a song from YouTube.",
    category: "music",
    filename: __filename
},
async(robin, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        if (!q) return reply("*Please provide a song name or keywords to search for.*");
        
        await robin.sendPresenceUpdate('recording', from);
        await reply("*🎧 Searching for the song...*");

        const searchResults = await yts(q);
        if (!searchResults.videos || searchResults.videos.length === 0) {
            return reply(`❌ No results found for "${q}".`);
        }

        const video = searchResults.videos[0];
        const videoUrl = video.url;

        // Get video info
        const videoInfo = {
            title: video.title,
            url: video.url,
            thumbnail: video.thumbnail,
            views: video.views,
            likes: video.likes ? video.likes.toLocaleString() : "N/A",
            dislikes: video.dislikes ? video.dislikes.toLocaleString() : "N/A",
            duration: video.duration.timestamp || video.duration.toString(),
            uploaded: video.ago,
            channel: video.author.name,
            description: video.description || "No description available"
        };

        // First API endpoint
        const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${videoUrl}`;
        const response = await axios.get(apiUrl);

        if (!response.data.success) {
            return reply(`❌ Failed to fetch audio for "${q}".`);
        }

        const { title, download_url } = response.data.result;

        if (!download_url) {
            return reply(`❌ Download URL not found for "${q}".`);
        }

        // Prepare the info message with thumbnail
        const infoMessage = `
        
╔══════════════════╗
  ♫♪♫  𝕾𝖔𝖓𝖌 𝕯𝖊𝖙𝖆𝖎𝖑𝖘  ♫♪♫
╚══════════════════╝

▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔

🎼 𝗧𝗜𝗧𝗟𝗘:
   ┣✦ ${videoInfo.title}

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

📜 𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗇:
   ┣✦ ${videoInfo.description.substring(0, 120)}${videoInfo.description.length > 120 ? '...' : ''}

▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔

⏳ 𝗗𝗨𝗥𝗔𝗧𝗜𝗢𝗡:
   ┣✦ ${videoInfo.duration}

🗓️ 𝗨𝗣𝗟𝗢𝗔𝗗 𝗗𝗔𝗧𝗘:
   ┣✦ ${videoInfo.uploaded}

👁️ 𝗩𝗜𝗘𝗪𝗦:
   ┣✦ ${videoInfo.views.toLocaleString()}

❤️ 𝗟𝗜𝗞𝗘𝗦:
   ┣✦ ${videoInfo.likes.toLocaleString()}

💔 𝗗𝗜𝗦𝗟𝗜𝗞𝗘𝗦:
   ┣✦ ${videoInfo.dislikes.toLocaleString()}

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

🎤 𝗖𝗛𝗔𝗡𝗡𝗘𝗟:
   ┣✦ ${videoInfo.channel}

🔗 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗟𝗜𝗡𝗞:
   ┣✦ ${videoInfo.url}

╔══════════════════╗
  ✦ 𝗛𝗮𝗻𝘀 𝗕𝘆𝘁𝗲 𝗠𝗗 ✦
╚══════════════════╝

        `.trim();

        // Send thumbnail image
        await robin.sendMessage(
            from,
            {
                image: { url: videoInfo.thumbnail },
                caption: infoMessage
            },
            { quoted: mek }
        );

        // Send the audio file
        await robin.sendMessage(
            from,
            {
                audio: { url: download_url },
                mimetype: "audio/mp4",
                ptt: false,
                fileName: `${title}.mp3`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error(error);
        return reply("❌ An error occurred while processing your request.");
    }
});


*/