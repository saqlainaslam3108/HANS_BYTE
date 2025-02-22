const { bot, forwardOrBroadCast, parsedJid } = require('../command');

bot(
  {
    pattern: 'vv ?(.*)',
    fromMe: true,
    desc: 'antiViewOnce',
    type: 'whatsapp',
  },
  async (message, match) => {
    if (
      !message.reply_message.image &&
      !message.reply_message.video &&
      !message.reply_message.audio
    ) {
      return await message.send(
        '*Example\n- reply to a viewOnce image, video or audio*\n- vv jid (optional)'
      );
    }
    const [jid] = parsedJid(match);
    await forwardOrBroadCast(jid || message.jid, message, { viewOnce: false });
  }
);
