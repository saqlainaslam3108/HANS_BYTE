const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "mf",
    react: "📤",
    desc: "Upload files from Mediafire",
    category: "upload",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, args, q, reply }) => {
    try {
      if (!q) return reply("*Provide a Mediafire link to upload.* 📤");

      const mediafireUrl = q;
      const apiUrl = `https://api.genux.me/api/download/mediafire?url=${encodeURIComponent(mediafireUrl)}&apikey=GENUX-PANSILU-NETHMINA-`;

      reply("🔄 *Fetching Mediafire link...*");

      // Fetch the API response
      const { data } = await axios.get(apiUrl);
      console.log("API Response:", data); // Debugging

      if (!data || !data.link) {
        return reply(`❌ *Failed to retrieve download link.*\n\n*API Response:* ${JSON.stringify(data, null, 2)}`);
      }

      const fileUrl = data.link;
      const fileName = data.filename || "file";
      const fileSize = parseFloat(data.size) || 0;

      // File size check (limit: 50MB)
      if (fileSize > 50) {
        return reply(`⚠️ *File is too large to send on WhatsApp!* (Size: ${fileSize}MB)\n\n📩 *Download manually:* ${fileUrl}`);
      }

      reply("🔄 *Uploading file...*");

      // Send document with correct MIME type
      await robin.sendMessage(
        from,
        {
          document: { url: fileUrl },
          mimetype: data.mimetype || "application/octet-stream",
          fileName: fileName,
          caption: `📄 *Here is your file!*`,
        },
        { quoted: mek }
      );

      reply(`✅ *Your file has been uploaded successfully!* 📤`);
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
