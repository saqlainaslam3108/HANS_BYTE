robin.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message =
        getContentType(mek.message) === "ephemeralMessage"
            ? mek.message.ephemeralMessage.message
            : mek.message;

    if (
        mek.key &&
        mek.key.remoteJid === "status@broadcast" &&
        config.AUTO_READ_STATUS === "true"
    ) {
        await robin.readMessages([{ remoteJid: mek.key.remoteJid, id: mek.key.id }]);
    }

    const m = sms(robin, mek);
    const type = getContentType(mek.message);
    const content = JSON.stringify(mek.message);
    const from = mek.key.remoteJid;
    const quoted =
        type == "extendedTextMessage" &&
        mek.message.extendedTextMessage.contextInfo != null
            ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
            : [];
    const body =
        type === "conversation"
            ? mek.message.conversation
            : type === "extendedTextMessage"
                ? mek.message.extendedTextMessage.text
                : type == "imageMessage" && mek.message.imageMessage.caption
                    ? mek.message.imageMessage.caption
                    : type == "videoMessage" && mek.message.videoMessage.caption
                        ? mek.message.videoMessage.caption
                        : "";
    const isCmd = body.startsWith(prefix);
    const command = isCmd
        ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
        : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.fromMe
        ? robin.user.id.split(":")[0] + "@s.whatsapp.net" || robin.user.id
        : mek.key.participant || mek.key.remoteJid;
    const senderNumber = sender.split("@")[0];
    const botNumber = robin.user.id.split(":")[0];
    const pushname = mek.pushName || "Sin Nombre";
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;
    const botNumber2 = await jidNormalizedUser(robin.user.id);
    const groupMetadata = isGroup
        ? await robin.groupMetadata(from).catch((e) => { })
        : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const participants = isGroup ? await groupMetadata.participants : "";
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : "";
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
    const isReact = m.message.reactionMessage ? true : false;
    const reply = (teks) => {
        robin.sendMessage(from, { text: teks }, { quoted: mek });
    };
});
