const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const config = require('../config');

cmd({
    pattern: "jokes",
    desc: "Fetch a random joke",
    category: "fun",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { reply, sender, from }) => {
    try {
        let res = await fetchJson("https://official-joke-api.appspot.com/random_joke");
        let imageUrl = "https://i.ibb.co/PS5DZdJ/Chat-GPT-Image-Mar-30-2025-12-53-39-PM.png";

        if (res && res.setup && res.punchline) {
            const jokeMessage = `${res.setup}\n\n👉 ${res.punchline}`;
            
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

            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: jokeMessage,
                contextInfo: newsletterContext,
            }, { quoted: mek });
        } else {
            return reply("Couldn't fetch a joke at the moment. Try again later!");
        }
    } catch (e) {
        console.error(e);
        return reply(`Error: ${e.message || e}`);
    }
});

cmd({
    pattern: "quote",
    desc: "Get a random motivational quote.",
    category: "other",
    react: "💡",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://api.davidcyriltech.my.id/random/quotes');
        const data = response.data;
        let imageUrl = "https://i.ibb.co/6Rxhg321/Chat-GPT-Image-Mar-30-2025-03-39-42-AM.png";

        if (!data.success) {
            return reply("❌ Failed to fetch a quote. Please try again.");
        }

        const quoteMessage = `💬 *Quote of the Day* 💬\n\n_\"${data.response.quote}\"_\n\n- *${data.response.author}*`;
        
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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });
    } catch (error) {
        console.error("Error fetching quote:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

cmd({
    pattern: "pickupline",
    desc: "Get a random pick-up line.",
    category: "other",
    react: "💡",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://apis.davidcyriltech.my.id/pickupline');
        const data = response.data;
        let imageUrl = "https://i.ibb.co/6Rxhg321/Chat-GPT-Image-Mar-30-2025-03-39-42-AM.png";

        if (!data.success) {
            return reply("❌ Failed to fetch a pick-up line. Please try again.");
        }

        // Use correct property name
        const quoteMessage = `💬 *PICKUPLINE of the Day* 💬\n\n_\"${data.pickupline}\"_\n\n`;
        
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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });
    } catch (error) {
        console.error("Error fetching pick-up line:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

cmd({
    pattern: "facts",
    desc: "Get a random fact.",
    category: "other",
    react: "💡",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://apis.davidcyriltech.my.id/fact');
        const data = response.data;
        let imageUrl = "https://i.ibb.co/6Rxhg321/Chat-GPT-Image-Mar-30-2025-03-39-42-AM.png";

        if (!data.success) {
            return reply("❌ Failed to fetch a pick-up line. Please try again.");
        }

        // Use correct property name
        const quoteMessage = `💬 *Fact of the Day* 💬\n\n_\"${data.fact}\"_\n\n`;
        
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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });
    } catch (error) {
        console.error("Error fetching fact line:", error);
        reply(`❌ Error: ${error.message}`);
    }
});
