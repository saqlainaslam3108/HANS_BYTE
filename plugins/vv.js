const commandInfo = {
  pattern: 'vv',
  alias: ["retrive", '🔥'],
  desc: "Fetch and resend a ViewOnce message content (image/video).",
  category: "convert",
  use: "<query>",
  filename: __filename
};

cmd(commandInfo, async (client, message, args, { from, reply }) => {
  try {
    const quotedMessage = args.msg.contextInfo?.quotedMessage;

    if (quotedMessage && quotedMessage.viewOnceMessageV2) {
      const viewOnceMsg = quotedMessage.viewOnceMessageV2.message;

      if (viewOnceMsg.imageMessage) {
        let caption = viewOnceMsg.imageMessage.caption;
        let mediaPath = await client.downloadAndSaveMediaMessage(viewOnceMsg.imageMessage);
        
        return client.sendMessage(from, { image: { url: mediaPath }, caption }, { quoted: message });
      }

      if (viewOnceMsg.videoMessage) {
        let caption = viewOnceMsg.videoMessage.caption;
        let mediaPath = await client.downloadAndSaveMediaMessage(viewOnceMsg.videoMessage);
        
        return client.sendMessage(from, { video: { url: mediaPath }, caption }, { quoted: message });
      }

      if (viewOnceMsg.audioMessage) {
        let mediaPath = await client.downloadAndSaveMediaMessage(viewOnceMsg.audioMessage);
        
        return client.sendMessage(from, { audio: { url: mediaPath } }, { quoted: message });
      }
    }

    if (!args.quoted) return reply("Please reply to a ViewOnce message.");

    const quotedMsg = args.quoted.message;

    if (args.quoted.mtype === "viewOnceMessage") {
      if (quotedMsg.imageMessage) {
        let caption = quotedMsg.imageMessage.caption;
        let mediaPath = await client.downloadAndSaveMediaMessage(quotedMsg.imageMessage);
        
        return client.sendMessage(from, { image: { url: mediaPath }, caption }, { quoted: message });
      }

      if (quotedMsg.videoMessage) {
        let caption = quotedMsg.videoMessage.caption;
        let mediaPath = await client.downloadAndSaveMediaMessage(quotedMsg.videoMessage);
        
        return client.sendMessage(from, { video: { url: mediaPath }, caption }, { quoted: message });
      }
    }

    if (quotedMsg.audioMessage) {
      let mediaPath = await client.downloadAndSaveMediaMessage(quotedMsg.audioMessage);
      
      return client.sendMessage(from, { audio: { url: mediaPath } }, { quoted: message });
    }

    return reply("This is not a ViewOnce message.");
  } catch (error) {
    console.log("Error:", error);
    reply("An error occurred while fetching the ViewOnce message.");
  }
});
