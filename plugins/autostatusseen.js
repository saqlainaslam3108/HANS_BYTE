module.exports = {
  name: 'autoStatusSeen',
  type: 'auto',
  description: 'Automatically views WhatsApp statuses',
  async onLoad(sock) {
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') {
        const message = messages[0]

        // Status updates are in broadcast messages
        if (message.key.remoteJid.endsWith('@broadcast')) {
          console.log(`[STATUS] Seen: ${message.pushName} (${message.key.remoteJid})`)

          try {
            await sock.sendReadReceipt(message.key.remoteJid, message.key.id)
            console.log(`[STATUS SEEN] Marked as seen for: ${message.key.remoteJid}`)
          } catch (err) {
            console.error('[AUTO STATUS SEEN ERROR]', err)
          }
        }
      }
    })
  }
}
