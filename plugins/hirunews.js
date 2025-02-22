const axios = require('axios');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "hirucheck",
    alias: ["hirunews", "newshiru", "hirulk"],
    react: "⭐",
    category: "search hiru news",
    desc: "Fetch the latest news from Hiru API.",
    use: "",
    filename: __filename,
},
    async (conn, mek, m, {
        from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber,
        botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName,
        participants, groupAdmins, isBotAdmins, isAdmins, reply
    }) => {
        try {
            const apiUrl = `https://suhas-bro-apii.vercel.app/hiru`; // Using Suhas API
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data || !data.newsURL || !data.title || !data.image || !data.text) {
                return reply(`*No News Available At This Moment* ❗`);
            }

            const { newsURL, title, image, text, Power } = data;

            let newsInfo = "𝐕𝐎𝐑𝐓𝐄𝐗-𝐌𝐃 𝐇𝐢𝐫𝐮 𝐍𝐞𝐰𝐬 𝐔𝐩𝐝𝐚𝐭𝐞 📰\n\n";
            newsInfo += `✨ *Title*: ${title}\n\n`;
            newsInfo += `📑 *Description*:\n${text}\n\n`;
            newsInfo += `⛓️‍💥 *Url*: www.hirunews.lk\n\n`;
            newsInfo += `> *© Powered By Pansilu Nethmina | VORTEX MD*\n\n*${Power}*`;

            if (image) {
                await conn.sendMessage(m.chat, {
                    image: { url: image },
                    caption: newsInfo,
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
            }

        } catch (error) {
            console.error(error);
            reply(`*An Error Occurred While Fetching News At This Moment* ❗`);
        }
    }
);


දැන් Suhas API (https://suhas-bro-apii.vercel.app/hiru) භාවිතා කරලා VORTEX MD සඳහා ගැලපෙන විදිහට API එක සෙට් කරලා.

එය බොට් එකේ වැඩ කරනවාද කියලා පරීක්ෂා කරලා බලන්න. කොහෙ හරි වැරදික් තිබ්බොත් කියන්න!

