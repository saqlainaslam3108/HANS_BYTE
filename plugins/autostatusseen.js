module.exports = {
  name: 'autoStatusSeen',
  type: 'auto',
  description: 'Automatically marks statuses as seen',
  async onLoad(sock) {
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') {
        const message = messages[0]
        try {
          await sock.sendReadReceipt(message.key.remoteJid, message.key.id)
          console.log(`[AUTO SEEN] Marked status as seen for: ${message.key.remoteJid}`)
        } catch (err) {
          console.error('[AUTO SEEN ERROR]', err)
        }
      }
    })
  }
}
