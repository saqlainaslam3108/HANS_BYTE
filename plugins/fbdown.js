const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const domain = `https://mr-manul-ofc-apis.vercel.app`;  // API domain without API key

cmd({
    pattern: "fb",
    alias: ["randomfb", "rfacebook", "rfb"],
    desc: 'Download Facebook Video (SD/HD)',
    use: '.rfacebook link',
    react: "🎥",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('Please provide a Facebook video link.');
        
        // Log the provided link for debugging
        console.log(`Received link: ${q}`);
        
        // Fetch data from the Facebook download API (no API key needed)
        const response = await fetchJson(`${domain}/download-facebook?url=${q}`);
        
        // Log the response for debugging
        console.log('API Response:', response);

        if (!response || !response.data) {
            return reply('Failed to fetch video details. Please make sure the link is valid.');
        }

        const fbData = response.data;
        const title = fbData.title;
        const cover = fbData.coverImage;
        const sdVideoUrl = fbData.sdVideoUrl;
        const hdVideoUrl = fbData.hdVideoUrl;

        let desc = `
*🎬 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 🎬*

*𝗧𝗶𝘁𝗹𝗲 -:* _~${title}~_

*◄❪ Reply This Message With Numbers ❫►*

1. 𝗦𝗗 𝗤𝘂𝗮𝗹𝗶𝘁𝘆 🎥
2. 𝗛𝗗 𝗤𝘂𝗮𝗹𝗶𝘁𝘆 🎥

> *⚖️Powered By - : VORTEX MD 💚*
`;

        const vv = await conn.sendMessage(from, { image: { url: cover }, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
                        await conn.sendMessage(from, { video: { url: sdVideoUrl }, mimetype: "video/mp4", caption: "> Powered By - : VORTEX MD 💚" }, { quoted: mek });
                        break;
                        
                    case '2':
                        await conn.sendMessage(from, { video: { url: hdVideoUrl }, mimetype: "video/mp4", caption: "> Powered By - : VORTEX MD 💚" }, { quoted: mek });
                        break;

                    default:
                        reply("Invalid option. Please select a valid option 💗");
                }
            }
        });

    } catch (e) {
        console.error('Error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('An error occurred while processing your request. Please try again later.');
    }
});
