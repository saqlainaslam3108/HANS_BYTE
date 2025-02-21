const { cmd } = require("../command");
const axios = require("axios");
const path = require("path");

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

      // Extract file name and extension from URL
      const fileUrl = q;
      const fileName = path.basename(fileUrl);
      const fileExtension = path.extname(fileName).substring(1).toLowerCase();

      // Get the file as a buffer
      const fileBuffer = await axios.get(fileUrl, { responseType: "arraybuffer" });

      // Set MIME type based on file extension
      let mimeType = "application/octet-stream"; // Default MIME type for unknown files
      if (["mp4", "mkv", "avi", "mov"].includes(fileExtension)) mimeType = "video/mp4";
      else if (fileExtension === "apk") mimeType = "application/vnd.android.package-archive";
      else if (fileExtension === "jpg" || fileExtension === "jpeg") mimeType = "image/jpeg";
      else if (fileExtension === "png") mimeType = "image/png";
      else if (fileExtension === "pdf") mimeType = "application/pdf";
      else if (fileExtension === "txt") mimeType = "text/plain";
      else if (fileExtension === "zip" || fileExtension === "rar") mimeType = "application/zip";
      else if (fileExtension === "mp3") mimeType = "audio/mpeg";
      
      // If the file is video, use document type (for better compatibility)
      if (["mp4", "mkv", "avi", "mov"].includes(fileExtension)) {
        await robin.sendMessage(
          from,
          {
            document: { url: fileUrl },
            mimetype: mimeType,
            fileName: fileName,
            caption: `Here is your ${fileExtension.toUpperCase()} video!`,
          },
          { quoted: mek }
        );
      } else {
        // For other file types, upload them normally
        await robin.sendMessage(
          from,
          {
            document: { url: fileUrl },
            mimetype: mimeType,
            fileName: fileName,
            caption: `Here is your ${fileExtension.toUpperCase()} file!`,
          },
          { quoted: mek }
        );
      }

      reply(`*Your ${fileExtension.toUpperCase()} file has been uploaded successfully!* 📤`);
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
