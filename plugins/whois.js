const { cmd } = require("../command");

cmd({
  pattern: "whois",
  alias: ["userinfo", "who"],
  react: "🕵️‍♂️",
  desc: "Fetch user profile picture and status.",
  category: "utility",
  use: ".whois [or reply to a user]",
  filename: __filename,
}, async (robin, mek, m, { from, quoted, reply, sender }) => {
  try {
    let userJid = quoted ? quoted.sender : sender;
    let userName = quoted ? `@${quoted.sender.split("@")[0]}` : m.pushName;

    let ppUrl;
    try {
      ppUrl = await robin.profilePictureUrl(userJid, "image");
    } catch {
      ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg"; // Default profile pic
    }

    let status;
    try {
      status = await robin.fetchStatus(userJid);
    } catch {
      status = { status: "About not accessible due to user privacy" };
    }

    const contextInfo = {
      mentionedJid: [userJid],
      forwardingScore: 1000,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363292876277898@newsletter",
        newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
        serverMessageId: 143,
      },
    };

    const userInfoMessage = {
      image: { url: ppUrl },
      caption: `👤 *Name:* ${userName}\n📜 *About:* ${status.status}`,
      contextInfo,
    };

    await robin.sendMessage(from, userInfoMessage, { quoted: mek });

  } catch (error) {
    console.error("Error fetching user info:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
