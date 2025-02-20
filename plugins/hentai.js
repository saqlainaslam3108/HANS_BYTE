/*
Please Give Credit 🙂❤️
⚖️ Powered By - : VORTEX MD | Pansilu Nethmina 💚
*/

const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const domain = `https://mr-manul-ofc-apis.vercel.app`;
const api_key = `Manul-Ofc-Sl-Sub-Key-9`;

//===== Api-Key එක Message එකක් දාල ඉල්ලගන්න, +94 74 227 4855 සල්ලි ගන්න නෙවේ, කීයක් Use කරනවද දැනගන්න...❤️=====

cmd({
    pattern: "hentai",
    alias: ["hentaiSearch"],
    react: '🔥',
    category: "download",
    desc: "Search hentai content and get HD download links via buttons",
    filename: __filename
}, async (conn, m, mek, { from, isMe, isOwner, q, reply, args }) => {
    try {
        // Check if search query is provided
        if (!q || q.trim() === '')
            return await reply('*Please provide a search query! (e.g., Anime Title)*');
        if (!isMe && !isOwner)
            return await reply('*Only Bot Number Can Use This Command!!!*');

        // Fetch search results from API (Assuming the endpoint exists)
        const searchRes = await fetchJson(`${domain}/api/hentai-search?query=${q}&apikey=${api_key}`);
        const hentaiData = searchRes.data.data; // Expecting data.data to be an array

        // Check if valid results were returned
        if (!Array.isArray(hentaiData) || hentaiData.length === 0) {
            return await reply(`No results found for: ${q}`);
        }

        // Limit to first 10 results
        const searchResults = hentaiData.slice(0, 10);

        // Format and send the search results message with buttons for selection
        let resultsMessage = `🍑 *Hentai Search Results for* "${q}":\n\n`;
        let buttons = [];
        searchResults.forEach((result, index) => {
            const title = result.title || 'No title available';
            resultsMessage += `*${index + 1}.* ${title}\n`;
            buttons.push({
                buttonId: `hentai_select_${index}`,
                buttonText: { displayText: `${index + 1}` },
                type: 1
            });
        });
        resultsMessage += `\n_Select a hentai by tapping the button below._`;

        const sentMsg = await conn.sendMessage(m.chat, {
            image: { url: searchResults[0].thumbnail || 'https://via.placeholder.com/150' },
            caption: resultsMessage,
            buttons: buttons,
            footer: 'Powered By - VORTEX MD | Pansilu Nethmina'
        }, { quoted: mek });

        // Listen for button response for hentai selection
        conn.ev.on('messages.upsert', async (update) => {
            try {
                const msg = update.messages[0];
                if (!msg.message || !msg.message.buttonsResponseMessage) return;
                const buttonResponse = msg.message.buttonsResponseMessage;
                const selectedId = buttonResponse.selectedButtonId; // e.g., "hentai_select_2"
                if (!selectedId.startsWith("hentai_select_")) return;

                const selectedIndex = parseInt(selectedId.split("_")[2]);
                if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= searchResults.length) {
                    return await reply('Invalid selection. Please try again.');
                }
                // Proceed with the selected hentai item
                const selectedItem = searchResults[selectedIndex];
                const infoRes = await fetchJson(`${domain}/api/hentai-info?url=${encodeURIComponent(selectedItem.link)}&apikey=${api_key}`);

                const hentaiDetails = infoRes.data;
                let downloadLinks = hentaiDetails.downloadLinks || [];
                // Filter only HD links (quality text contains "hd" case-insensitive)
                downloadLinks = downloadLinks.filter(link => {
                    const quality = link.quality.toLowerCase();
                    return quality.includes('hd');
                });

                if (downloadLinks.length === 0) {
                    return await reply('No HD download links found for this content.');
                }

                // Build buttons for each HD download link
                let downloadMessage = `🍑 *${hentaiDetails.title}*\n\n*Available HD Download Links:*\n`;
                let dlButtons = [];
                downloadLinks.forEach((link, idx) => {
                    downloadMessage += `*${idx + 1}.* ${link.quality} - ${link.size}\n`;
                    dlButtons.push({
                        buttonId: `hentai_dl_${selectedIndex}_${idx}`, // include selected item index and link index
                        buttonText: { displayText: `${idx + 1}` },
                        type: 1
                    });
                });
                downloadMessage += `\n_Tap the button for your desired download link._`;

                await conn.sendMessage(m.chat, {
                    image: { url: selectedItem.thumbnail || 'https://via.placeholder.com/150' },
                    caption: downloadMessage,
                    buttons: dlButtons,
                    footer: 'Powered By - VORTEX MD | Pansilu Nethmina'
                }, { quoted: msg });
            } catch (err) {
                console.error('Error in hentai button selection:', err);
            }
        });

        // Listen for button response for download link selection
        conn.ev.on('messages.upsert', async (update) => {
            try {
                const msg = update.messages[0];
                if (!msg.message || !msg.message.buttonsResponseMessage) return;
                const buttonResponse = msg.message.buttonsResponseMessage;
                const selectedId = buttonResponse.selectedButtonId; // e.g., "hentai_dl_2_1"
                if (!selectedId.startsWith("hentai_dl_")) return;

                const parts = selectedId.split("_");
                if (parts.length < 3) return;
                const itemIndex = parseInt(parts[2]);
                const linkIndex = parseInt(parts[3]);
                if (isNaN(itemIndex) || isNaN(linkIndex)) return;

                // Retrieve the hentai item using the original search results
                const infoRes = await fetchJson(`${domain}/api/hentai-info?url=${encodeURIComponent(searchResults[itemIndex].link)}&apikey=${api_key}`);
                const hentaiDetails = infoRes.data;
                let downloadLinks = hentaiDetails.downloadLinks || [];
                downloadLinks = downloadLinks.filter(link => link.quality.toLowerCase().includes('hd'));

                if (linkIndex < 0 || linkIndex >= downloadLinks.length) {
                    return await reply('Invalid selection. Please try again.');
                }

                const selectedLink = downloadLinks[linkIndex];
                const file = selectedLink.link;
                const fileRes = await fetchJson(`${domain}/api/hentai-direct-link?url=${encodeURIComponent(file)}&apikey=${api_key}`);
                const downloadLink = fileRes.data.downloadLink;
                const fileId = downloadLink.split('/').pop();

                // Send reactions to indicate process start
                await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

                const directDownloadUrl = `https://pixeldrain.com/api/file/${fileId}`;

                await conn.sendMessage(from, { react: { text: '⬆', key: mek.key } });

                // Send the final document message with the direct download link
                await conn.sendMessage(from, {
                    document: { url: directDownloadUrl },
                    mimetype: 'video/mp4',
                    fileName: `${hentaiDetails.title} - ${selectedLink.quality}.mp4`,
                    caption: `${hentaiDetails.title}\nQuality: ${selectedLink.quality}\n\n> ⚖️ Powered By - VORTEX MD | Pansilu Nethmina 💚`
                }, { quoted: msg });

                await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
            } catch (err) {
                console.error('Error in hentai download button selection:', err);
                await reply('Sorry, something went wrong during the download process.');
            }
        });

    } catch (error) {
        console.error('Error in hentai command:', error);
        await reply('Sorry, something went wrong. Please try again later.');
    }
});

//============= VORTEX MD | Pansilu Nethmina 💚 ==========
