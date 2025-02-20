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

        // Fetch search results from API
        const searchUrl = `${domain}/api/hentai-search?query=${encodeURIComponent(q)}&apikey=${api_key}`;
        const searchRes = await fetchJson(searchUrl);
        if (!searchRes || !searchRes.data || !Array.isArray(searchRes.data.data)) {
            return await reply('API response structure is unexpected. Please try again later.');
        }
        const hentaiData = searchRes.data.data;

        // Check if valid results were returned
        if (hentaiData.length === 0) {
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

        // Send message with image, caption, and buttons
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
                const infoUrl = `${domain}/api/hentai-info?url=${encodeURIComponent(selectedItem.link)}&apikey=${api_key}`;
                const infoRes = await fetchJson(infoUrl);
                if (!infoRes || !infoRes.data) {
                    return await reply('Failed to fetch hentai details. Please try again later.');
                }
                const hentaiDetails = infoRes.data;

                // Retrieve and filter download links for HD quality
                let downloadLinks = hentaiDetails.downloadLinks || [];
                downloadLinks = downloadLinks.filter(link => {
                    return link.quality && link.quality.toLowerCase().includes('hd');
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
                downloadMessage += `\
