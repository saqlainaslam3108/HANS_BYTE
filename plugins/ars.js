module.exports = async (conn, mek, config) => {
    try {
        mek = mek.messages[0];

        // Check if status auto-read and auto-react is enabled
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true") {
            await conn.readMessages([mek.key]);

            const emojis = ['🧩', '🍉', '💜', '🌸', '🪴', '💊', '💫', '🍂', '🌟', '🎋', '😶‍🌫️', '🫀', '🧿', '👀', '🤖', '🚩', '🥰', '🗿', '💜', '💙', '🌝', '🖤', '💚'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

            await conn.sendMessage(mek.key.remoteJid, {
                react: {
                    text: randomEmoji,
                    key: mek.key,
                }
            }, { statusJidList: [mek.key.participant] });
        }
    } catch (error) {
        console.error("Status Auto React Error:", error);
    }
};
