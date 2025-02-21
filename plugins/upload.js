const { cmd } = require("../command");
const axios = require("axios");
const path = require("path");

cmd(
  {
    pattern: "upload",
    react: "📤",
    desc: "Upload direct file",
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

      const fileUrl = q;

      // Extract file name and extension from the URL
      let fileName = path.basename(fileUrl);
      const fileExtension = path.extname(fileName).substring(1).toLowerCase();

      // Remove query parameters from the URL (e.g., after '?')
      const cleanFileName = fileName.split('?')[0];

      // If it's a video, add "VORTEX MD" watermark in the file name
      if (["mp4", "mkv", "avi", "mov"].includes(fileExtension)) {
        fileName = cleanFileName.replace(`.${fileExtension}`, ` - VORTEX MD.${fileExtension}`);
      } else {
        fileName = cleanFileName;
      }

      // Get the file as a buffer
      const fileBuffer = await axios.get(fileUrl, { responseType: "arraybuffer" });

      // Set MIME type based on file extension
      let mimeType = "application/octet-stream"; // Default MIME type for unknown files
      if (["mp4", "mkv", "avi", "mov"].includes(fileExtension)) mimeType = "video/mp4";
      else if (fileExtension === "apk") mimeType = "application/vnd.android.package-archive";
      else if (fileExtension === "jpg" || fileExtension === "jpeg") mimeType = "image/jpeg";
      else if (fileExtension === "png") mimeType = "image/png";
      else if (fileExtension === "pdf") mimeType = "application/pdf";

      // Send the file as a document (for video and other types)
      await robin.sendMessage(
        from,
        {
          document: { url: fileUrl },
          mimetype: mimeType,
          fileName: fileName,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
