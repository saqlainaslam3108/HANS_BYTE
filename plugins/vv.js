const { cmd, forwardOrBroadCast, parsedJid } = require('../command');

cmd(
  {
    pattern: 'vv ?(.*)',
    fromMe: true,
    desc: 'antiViewOnce - View Once image, video, or audio re-send without view-once restriction',
    type: 'whatsapp',
    category: 'utility',
    filename: __filename,
  },
  async (message, match) => {
    // පලමුව reply message එකක් තිබෙනවාද කියලා පරීක්ෂා කරන්න
    if (
      !message.reply_message ||
      (!message.reply_message.image &&
        !message.reply_message.video &&
        !message.reply_message.audio)
    ) {
      return await message.send(
        '*උදාහරණ:*\n- viewOnce image, video, හෝ audio එකකට reply කරන්න\n- vv jid (විකල්ප ලෙස jid එකද ලබා දිය හැක)'
      );
    }

    // jid එක parsedJid function එකෙන් extract කිරීම
    const [jid] = parsedJid(match);
    
    // forwardOrBroadCast function එකෙන් viewOnce restriction අහෝසි කිරීම
    await forwardOrBroadCast(jid || message.jid, message, { viewOnce: false });
  }
);
