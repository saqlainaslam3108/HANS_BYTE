const { cmd } = require('../command'); const { fetchJson } = require('../lib/functions');

const API_BASE = 'https://nsfw-api-pinkvenom.vercel.app/api/eporner';

cmd({ pattern: 'hentai', alias: ['hsearch', 'hdownload'], react: '🔞', category: 'nsfw', desc: 'Search and download hentai videos from Eporner', filename: __filename }, async (conn, m, mek, { q, reply }) => { try { if (!q || q.trim() === '') { return await reply('Please provide a search query! (e.g., nicolette shea)'); }

const searchResults = await fetchJson(`${API_BASE}/search?query=${encodeURIComponent(q)}`);
    if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
        return await reply(`No results found for: ${q}`);
    }

    let responseText = `🔎 *Search Results for* "${q}":\n\n`;
    let videoLinks = [];
    searchResults.results.slice(0, 5).forEach((result, index) => {
        responseText += `*${index + 1}.* ${result.title}\n🔗 Link: ${result.url}\n📸 Thumbnail: ${result.thumb}\n\n`;
        videoLinks.push(result.url);
    });

    await reply(responseText);

    conn.ev.on('messages.upsert', async (messageUpdate) => {
        const replyMek = messageUpdate.messages[0];
        if (!replyMek.message) return;
        const messageType = replyMek.message.conversation || replyMek.message.extendedTextMessage?.text;
        const selectedNumber = parseInt(messageType.trim());
        
        if (!isNaN(selectedNumber) && selectedNumber > 0 && selectedNumber <= videoLinks.length) {
            const downloadUrl = await fetchJson(`${API_BASE}/download?url=${encodeURIComponent(videoLinks[selectedNumber - 1])}`);
            if (downloadUrl && downloadUrl.download) {
                let resolutionMessage = `🎥 *Select Resolution for ${searchResults.results[selectedNumber - 1].title}*\n\n`;
                let resolutionOptions = [];
                downloadUrl.download.forEach((option, i) => {
                    resolutionMessage += `*${i + 1}.* ${option.quality}\n`;
                    resolutionOptions.push(option);
                });
                
                await reply(resolutionMessage);
                
                conn.ev.on('messages.upsert', async (resUpdate) => {
                    const resReplyMek = resUpdate.messages[0];
                    if (!resReplyMek.message) return;
                    const resMessageType = resReplyMek.message.conversation || resReplyMek.message.extendedTextMessage?.text;
                    const resSelectedNumber = parseInt(resMessageType.trim());
                    
                    if (!isNaN(resSelectedNumber) && resSelectedNumber > 0 && resSelectedNumber <= resolutionOptions.length) {
                        const selectedResolution = resolutionOptions[resSelectedNumber - 1];
                        await conn.sendMessage(m.chat, {
                            document: { url: selectedResolution.link },
                            mimetype: 'video/mp4',
                            fileName: `${searchResults.results[selectedNumber - 1].title} - ${selectedResolution.quality}.mp4`,
                            caption: `🎥 *${searchResults.results[selectedNumber - 1].title}*\nResolution: ${selectedResolution.quality}`
                        }, { quoted: resReplyMek });
                    }
                });
            } else {
                await reply('Download link not available.');
            }
        }
    });
} catch (error) {
    console.error('Error in hentai command:', error);
    await reply('Sorry, something went wrong. Please try again later.');
}

});

