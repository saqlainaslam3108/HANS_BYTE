module.exports = (sock) => {
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type === 'notify') {
      const message = messages[0]
      await sock.sendReadReceipt(message.key.remoteJid, message.key.id)
    }
  })
}
