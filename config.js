const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "m3523J4R#hFweCit7r0ggx_G2LTCvPYiRYmZSxEGL8UgGeHSIC2U",
  MONGODB: process.env.MONGODB || "mongodb+srv://pansilu:test@cluster0.mkvgq.mongodb.net/",
  OWNER_NUM: process.env.OWNER_NUM || "94763513529",
};
