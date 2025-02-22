const { makeWASocket, proto } = require('@whiskeysockets/baileys'); const { bot, parsedJid } = require('../lib');

bot( { pattern: 'vv ?(.*)', fromMe: true, desc: 'Remove view once restriction from media', type: 'whatsapp', }, async (message, match) => { if (!message.reply_message || !(message.reply_message.image || message.reply_message.video || message.reply_message.audio)) { return await message.send('Reply to a view once image, video, or audio with the command: vv [jid (optional)]'); }

const jid = parsedJid(match)[0] || message.jid;

const msg = proto.WebMessageInfo.fromObject(message.reply_message.data);
if (msg.message?.viewOnceMessage?.message) {
  msg.message = msg.message.viewOnceMessage.message;
  msg.viewOnce = false;
  await message.client.sendMessage(jid, msg.message, { quoted: message });
} else {
  await message.send('*This message is not a view once media*');
}

} );

