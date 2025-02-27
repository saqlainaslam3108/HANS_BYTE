const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const domain = `https://mr-manul-ofc-apis.vercel.app`;  // Same domain as before

cmd({
    pattern: "rfacebook",
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
        
        // Assuming the endpoint for Facebook video download is correct
        const response = await fetchJson(`${domain}/download-facebook?apikey=Your-API-Key&url=${q}`);
        
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

> *⚖️Powered By - : ©𝗩𝗢𝗥𝗧𝗘𝗫 𝗠𝗗 💤*
`;

        const vv = await conn.sendMessage(from, { image: { url: cover }, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
                        await conn.sendMessage(from, { video: { url: sdVideoUrl }, mimetype: "video/mp4", caption: "> Powered By - : ©𝗩𝗢𝗥𝗧𝗘𝗫 𝗠𝗗 💚" }, { quoted: mek });
                        break;
                        
                    case '2':
                        await conn.sendMessage(from, { video: { url: hdVideoUrl }, mimetype: "video/mp4", caption: "> Powered By - : ©𝗩𝗢𝗥𝗧𝗘𝗫 𝗠𝗗 💚" }, { quoted: mek });
                        break;

                    default:
                        reply("Invalid option. Please select a valid option 💗");
                }
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('An error occurred while processing your request.');
    }
});
