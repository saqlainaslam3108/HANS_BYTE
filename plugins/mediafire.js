const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "mediafire",
    react: "📤",
    desc: "Upload files from Mediafire",
    category: "upload",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, args, q, reply }) => {
    try {
      if (!q) return reply("*Provide a Mediafire link to upload.* 📤");

      const mediafireUrl = q;
      const apiUrl = `https://ipa-oya.vercel.app/mfire?url=${encodeURIComponent(mediafireUrl)}`;

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

      // Test the actual file download
      reply("🔄 *Verifying file link...*");

      const testResponse = await axios.get(fileUrl, {
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" }, // Prevent HTML page download
      });

      if (testResponse.headers["content-type"].includes("text/html")) {
        return reply(`❌ *Mediafire link is not a direct download link!*\n\n👉 *Try downloading manually:* ${fileUrl}`);
      }

      if (testResponse.data.length < 1000) {
        return reply(`❌ *File link might be broken!*\n\n👉 *Try manual download:* ${fileUrl}`);
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
