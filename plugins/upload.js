const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "upload",
    react: "📤",
    desc: "Upload files",
    category: "upload",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("*Provide a direct download link to upload.* 📤");

      // Direct link to download file
      const fileUrl = q;
      const fileBuffer = await axios.get(fileUrl, { responseType: "arraybuffer" });

      // Send file to user
      await robin.sendMessage(
        from,
        {
          document: { url: fileUrl },
          mimetype: "application/octet-stream",
          caption: "Here is your file!",
        },
        { quoted: mek }
      );

      reply("*Your file has been uploaded successfully!* 📤");
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
