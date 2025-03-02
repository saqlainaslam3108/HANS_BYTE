const { cmd } = require("../command");
const axios = require("axios");

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

      await conn.sendMessage(msg.key.remoteJid, { react: { text: "⬇️", key: msg.key } });

      // Fetch the APK file
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

      // Send the APK file with watermark name
      await conn.sendMessage(msg.key.remoteJid, { 
        document: Buffer.from(response.data), 
        mimetype: "application/vnd.android.package-archive",
        fileName: `${appName}_VORTEX_MD.apk`,
        caption: `📥 Downloaded APK: *${appName}*\n🚀 Watermark: *VORTEX MD*`
      });

    } catch (error) {
      console.error("Error:", error);
      reply("❌ Error downloading APK.");
    }
  }
);
