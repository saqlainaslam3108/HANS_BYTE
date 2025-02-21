/*
Please Give Credit 🙂❤️
⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚
*/

const { cmd } = require('../command');
const { search, getep, dl } = require("darksadasyt-anime");
const { fetchJson } = require('../lib/functions'); // if needed for other API calls

cmd({
    pattern: "anime",
    alias: ["anidownload"],
    react: '🎬',
    category: "download",
    desc: "Search anime and get download links",
    filename: __filename
}, async (conn, m, mek, { from, isMe, isOwner, q, reply }) => {
    try {
        // Check if search query is provided
        if (!q || q.trim() === '') {
            return await reply('*Please provide an anime name or link.*');
        }
        if (!isMe && !isOwner) {
            return await reply('*This command can only be used by the bot number!*');
        }

        // Search for anime using darksadasyt-anime package
        const animeResults = await search(q);
        if (!Array.isArray(animeResults) || animeResults.length === 0) {
            return await reply(`No anime found for "${q}".`);
        }

        // Limit search results (e.g., first 10)
        const searchResults = animeResults.slice(0, 10);
        let resultsMessage = `🎬 *Anime results for "${q}":*\n\n`;
        searchResults.forEach((result, index) => {
            resultsMessage += `*${index + 1}.* ${result.title}\n🔗 Link: ${result.link}\n\n`;
        });

        const sentMsg = await conn.sendMessage(m.chat, {
            image: { url: searchResults[0].thumbnail || 'https://via.placeholder.com/150' },
            caption: resultsMessage
        }, { quoted: mek });

        const messageID = sentMsg.key.id;
        await reply("Please send the number corresponding to the anime you want.");

        // Listen for user selection of anime from search results
        conn.ev.on('messages.upsert', async (messageUpdate) => {
            try {
                const replyMsg = messageUpdate.messages[0];
                if (!replyMsg.message) return;
                const userText = replyMsg.message.conversation || replyMsg.message.extendedTextMessage?.text;
                const isReplyToSentMsg = replyMsg.message.extendedTextMessage && replyMsg.message.extendedTextMessage.contextInfo.stanzaId === messageID;
                if (isReplyToSentMsg) {
                    const selectedNumber = parseInt(userText.trim());
                    if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > searchResults.length) {
                        return await reply('Invalid number. Please reply with a valid number.');
                    }
                    // Get selected anime details
                    const selectedAnime = searchResults[selectedNumber - 1];
                    const animeLink = selectedAnime.link;
                    // Fetch anime details and episode list
                    const details = await getep(animeLink);
                    const episodes = details.results;
                    const animeTitle = details.result.title;
                    if (!Array.isArray(episodes) || episodes.length === 0) {
                        return await reply("No episodes found for this anime.");
                    }

                    let episodeList = `🎬 *${animeTitle}* - Available Episodes:\n`;
                    episodes.forEach((ep, i) => {
                        episodeList += `\n${i + 1}. Episode ${ep.episode}`;
                    });
                    const sentEpMsg = await conn.sendMessage(m.chat, { text: episodeList }, { quoted: replyMsg });
                    const epMessageID = sentEpMsg.key.id;
                    await reply("Please send the episode number you want to download.");

                    // Listen for user's reply for episode selection
                    conn.ev.on('messages.upsert', async (epUpdate) => {
                        try {
                            const epReply = epUpdate.messages[0];
                            if (!epReply.message) return;
                            const epText = epReply.message.conversation || epReply.message.extendedTextMessage?.text;
                            const isReplyToEpMsg = epReply.message.extendedTextMessage && epReply.message.extendedTextMessage.contextInfo.stanzaId === epMessageID;
                            if (isReplyToEpMsg) {
                                const episodeNumber = parseInt(epText.trim());
                                if (isNaN(episodeNumber) || episodeNumber < 1 || episodeNumber > episodes.length) {
                                    return await reply('Invalid episode number. Please reply with a valid number.');
                                }
                                const selectedEpisode = episodes[episodeNumber - 1];
                                const epDownloadLink = `https://animeheaven.me/${selectedEpisode.url}`;

                                // Get download links for the episode
                                const downloadLinks = await dl(epDownloadLink);
                                if (!Array.isArray(downloadLinks) || downloadLinks.length === 0) {
                                    return await reply("No download link found for that episode.");
                                }

                                // Format download links info message
                                let downloadMsg = `🎬 *${animeTitle}* - Episode ${selectedEpisode.episode}\n\n*Available Quality Options:*\n`;
                                downloadLinks.forEach((link, idx) => {
                                    downloadMsg += `*${idx + 1}.* ${link.quality} - ${link.size}\n🔗 Link: ${link.link}\n\n`;
                                });
                                const sentDlMsg = await conn.sendMessage(m.chat, {
                                    image: { url: selectedAnime.thumbnail || 'https://via.placeholder.com/150' },
                                    caption: downloadMsg
                                }, { quoted: epReply });
                                const dlMessageID = sentDlMsg.key.id;
                                await reply("Please send the number corresponding to your desired quality.");

                                // Listen for quality selection reply
                                conn.ev.on('messages.upsert', async (dlUpdate) => {
                                    try {
                                        const qualityReply = dlUpdate.messages[0];
                                        if (!qualityReply.message) return;
                                        const qualityText = qualityReply.message.conversation || qualityReply.message.extendedTextMessage?.text;
                                        const isReplyToDlMsg = qualityReply.message.extendedTextMessage && qualityReply.message.extendedTextMessage.contextInfo.stanzaId === dlMessageID;
                                        if (isReplyToDlMsg) {
                                            const qualityNumber = parseInt(qualityText.trim());
                                            if (isNaN(qualityNumber) || qualityNumber < 1 || qualityNumber > downloadLinks.length) {
                                                return await reply('Invalid quality number. Please reply with a valid number.');
                                            }
                                            const selectedQuality = downloadLinks[qualityNumber - 1];
                                            const file = selectedQuality.link;
                                            
                                            // Assume the file link is direct
                                            const directDownloadUrl = file;
                                            
                                            await conn.sendMessage(from, {
                                                document: { url: directDownloadUrl },
                                                mimetype: 'video/mp4',
                                                fileName: `${animeTitle} - Episode ${selectedEpisode.episode} [${selectedQuality.quality}].mp4`,
                                                caption: `${animeTitle}\nEpisode: ${selectedEpisode.episode}\nQuality: ${selectedQuality.quality}\n\n> ⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚`
                                            }, { quoted: qualityReply });
                                        }
                                    } catch (error) {
                                        console.error('Error in quality selection:', error);
                                        await reply('Sorry, an error occurred while selecting the quality.');
                                    }
                                });
                            }
                        } catch (error) {
                            console.error('Error in episode selection:', error);
                            await reply('Sorry, an error occurred while selecting the episode.');
                        }
                    });
                }
            } catch (error) {
                console.error('Error in anime search selection:', error);
                await reply('Sorry, an error occurred while selecting the anime.');
            }
        });
    } catch (error) {
        console.error('Error in anime command:', error);
        await reply('Sorry, an error occurred. Please try again later.');
    }
});

/*
Powered By - VORTEX MD | Pansilu Nethmina 💚
*/
