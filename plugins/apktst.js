const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

cmd(
  {
    pattern: "apk",
    alias: ["app"],
    react: "📲",
    desc: "Download APK files.",
    category: "utility",
    use: ".apk <app name>",
    filename: __filename
  },
  async (conn, mek, msg, { reply, args }) => {
    try {
      const appName = args.join(" ");
      if (!appName) {
        return reply("❗️ Please provide an app name.");
      }

      const apiUrl = `https://saviya-kolla-api.koyeb.app/download/apk?q=${encodeURIComponent(appName)}`;
      const logoPath = "./media/logo.jpg"; // Bot Logo File Path

      await conn.sendMessage(msg.key.remoteJid, { react: { text: "⬇️", key: msg.key } });

      // Fetch the APK file
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

      // Save the APK to a buffer
      const apkBuffer = Buffer.from(response.data);
      const fileName = `${appName}_VORTEX_MD.apk`;

      // Send the logo
      if (fs.existsSync(logoPath)) {
        await conn.sendMessage(msg.key.remoteJid, { 
          image: { url: logoPath }, 
          caption: `🔹 *Downloading APK:* ${appName}\n🔹 *Powered by: VORTEX MD*`
        });
      }

      // Send the APK file with watermark name
      await conn.sendMessage(msg.key.remoteJid, { 
        document: apkBuffer, 
        mimetype: "application/vnd.android.package-archive",
        fileName: fileName,
        caption: `📥 Downloaded APK: *${appName}*\n🚀 Watermark: *VORTEX MD*`
      });

    } catch (error) {
      console.error("Error:", error);
      reply("❌ Error downloading APK.");
    }
  }
);
