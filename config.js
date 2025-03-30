const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "vZcEjZQa#QIZ5gyh8SdXsuvzOTT8jO0CU97ZLLtCStG6k_SHnqzI",
  SUDO: process.env.SUDO || "237696900612",
  OWNER_NUM: process.env.OWNER_NUM || "237696900612",
  PREFIX:process.env.PREFIX || ".",
  ALIVE_IMG:process.env.ALIVE_IMG||"https://i.ibb.co/6Rxhg321/Chat-GPT-Image-Mar-30-2025-03-39-42-AM.png",
  ALIVE_MSG:process.env.ALIVE_MSG || "Hello , I am alive now!!",
  MODE:process.env.MODE || "public",
  AUTO_VOICE:process.env.AUTO_VOICE|| "true",
  AUTO_STICKER:process.env.AUTO_STICKER|| "true",
  AUTO_REPLY:process.env.AUTO_REPLY|| "true",
  GEMINI_API_KEY:process.env.GEMINI_API_KEY || "AIzaSyDrhALyWLk7RN40C1sX5a03XVk8tO48P_8",
  MOVIE_API_KEY:process.env.MOVIE_API_KEY || "sky|d154108e41377cceb22ef92434509bc9081ae46b",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  STICKER_PACKNAME: process.env.STICKER_PACKNAME || 'HANS BYTE MD', // Default sticker pack name
  STICKER_AUTHOR: process.env.STICKER_AUTHOR || 'HANS TECH', // Default sticker author
  GROUP_PP_SIZE: process.env.GROUP_PP_SIZE || 512, // Group profile picture size
  USER_PP_SIZE: process.env.USER_PP_SIZE || 640 // User profile picture size
};
