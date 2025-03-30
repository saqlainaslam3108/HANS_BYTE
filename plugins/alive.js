const { cmd, commands } = require('../command');
const config = require('../config');
const path = require('path');

cmd(
  {
    pattern: "alive",
    react: "🤌",
    desc: "Check if the bot is online.",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      // Fix path issue using path module
      const audioPath = path.join(__dirname, '../media/Sunflower.mp3');

      // Debugging: Check if the file exists
      const fs = require('fs');
      if (!fs.existsSync(audioPath)) {
        return reply(`❌ Error: Audio file not found at ${audioPath}`);
      }

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

      // Update presence to indicate bot is active
      await robin.sendPresenceUpdate('recording', from);

      // Send the audio message with correct path
      await robin.sendMessage(
        from,
        {
          audio: { url: audioPath },
          mimetype: 'audio/mpeg',
          ptt: true,
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );

      // Send an "alive" image with newsletter context
      await robin.sendMessage(
        from,
        {
          image: { url: config.ALIVE_IMG },
          caption: config.ALIVE_MSG,
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
