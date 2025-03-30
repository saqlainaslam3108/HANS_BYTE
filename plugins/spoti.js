const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const https = require('https');

cmd({
    pattern: "spotify",
    alias: ["spdl", "spotifydl"],
    react: "🎵",
    desc: "Download Spotify tracks",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the prompt (Spotify URL) is provided
        if (!q) {
            return reply("*❌ Please provide a valid Spotify track URL!*\nExample: `.spotify <URL>`");
        }

        // Validate URL (basic check)
        if (!q.startsWith("https://open.spotify.com/track/")) {
            return reply("*❌ Invalid Spotify track URL!*");
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(q)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== 200 || !data.success) return reply("❌ Failed to fetch the Spotify track.");

        const trackInfo = {
            title: data.title || 'Unknown Title',
            channel: data.channel || 'Unknown Channel',
            duration: data.duration || 'Unknown Duration',
            thumbnail: data.thumbnail || '',
            downloadLink: data.DownloadLink || ''
        };

        if (!trackInfo.downloadLink) return reply("❌ No download link found for this track.");

        // Newsletter context info
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363292876277898@newsletter',
                newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
                serverMessageId: 143,
            },
        };

        let desc = `
╔══✦❘༻ *HANS BYTE* ༺❘✦══╗
┇  🎶 *𝗦𝗣𝗢𝗧𝗜𝗙𝗬 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥* 🎶
┇╭───────────────────
┇│•🎧 𝗧𝗶𝘁𝗹𝗲: ${trackInfo.title} 
┇│•🎤 𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ${trackInfo.channel}
┇│•⏳ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${trackInfo.duration}
┇│•🌐 𝗟𝗶𝗻𝗸: ${q}
╰─・─・─・─・─・─・─・─╯
╭━✦❘༻ 𝗦𝗢𝗡𝗚 𝗜𝗡𝗙𝗢 ༺❘✦━╮
│•🔗 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗟𝗜𝗡𝗞: ${trackInfo.downloadLink}
╰━✦❘༻ *HANS BYTE* ༺❘✦━╯
> POWERED BY HANS BYTE MD `;

        // Send the description and thumbnail as an image first
        await conn.sendMessage(from, {
            image: { url: trackInfo.thumbnail },
            caption: desc,
            contextInfo: newsletterContext
        }, { quoted: mek });

        // Now, download the MP3 file from the provided DownloadLink
        const filePath = path.join(__dirname, 'spotify_track.mp3');
        const fileStream = fs.createWriteStream(filePath);

        https.get(trackInfo.downloadLink, (res) => {
            res.pipe(fileStream);

            fileStream.on('finish', async () => {
                // Send the downloaded file as a message after sending the metadata
                await conn.sendMessage(from, {
                    audio: { url: filePath }, 
                    caption: `Enjoy the track! 🎶 - ${trackInfo.title}`,
                    contextInfo: newsletterContext
                }, { quoted: mek });

                // Clean up the downloaded file after sending it
                fs.unlinkSync(filePath);
            });
        }).on('error', (err) => {
            console.error('Error downloading the file:', err);
            reply("⚠️ Error downloading the Spotify track.");
        });

    } catch (e) {
        console.error("Error fetching Spotify track:", e);
        reply("⚠️ Error fetching the Spotify track.");
    }
});
