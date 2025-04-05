const axios = require('axios'); // Make sure you install axios if it's not already installed
const { cmd } = require('../command');

cmd(
  {
    pattern: "tempmail",
    react: "📧",
    desc: "Generate a temporary email address.",
    category: "utility",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
      const response = await axios.get('https://apis.davidcyriltech.my.id/temp-mail');

      if (response.data.success) {
        const email = response.data.email;
        const sessionId = response.data.session_id;
        const expiresAt = response.data.expires_at;

        reply(`🎉 Here is your temporary email address: ${email}\nIt will expire at: ${expiresAt}\nSession ID: ${sessionId}`);
      } else {
        reply('❌ Failed to generate temporary email address.');
      }
    } catch (error) {
      console.error(error);
      reply('❌ Error: Could not fetch temporary email address.');
    }
  }
);

cmd(
  {
    pattern: "checkmail",
    react: "📬",
    desc: "Check inbox for temporary email.",
    category: "utility",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
      if (args.length < 1) {
        return reply('❌ Please provide your session ID (use the tempmail command to get it).');
      }

      const sessionId = args[0];
      const response = await axios.get(`https://apis.davidcyriltech.my.id/temp-mail/inbox?id=${sessionId}`);

      if (response.data.success) {
        const inboxCount = response.data.inbox_count;
        const messages = response.data.messages;

        if (inboxCount > 0) {
          let messageList = '📬 You have new messages:\n';
          messages.forEach((message, index) => {
            messageList += `\n${index + 1}. From: ${message.from} - Subject: ${message.subject}`;
          });
          reply(messageList);
        } else {
          reply('✅ No new messages in your inbox.');
        }
      } else {
        reply('❌ Error checking inbox. Please check the session ID.');
      }
    } catch (error) {
      console.error(error);
      reply('❌ Error: Could not fetch inbox data.');
    }
  }
);
