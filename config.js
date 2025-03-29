const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "vZcEjZQa#QIZ5gyh8SdXsuvzOTT8jO0CU97ZLLtCStG6k_SHnqzI",
  OWNER_NUM: process.env.OWNER_NUM || "237696900612",
  PREFIX:process.env.PREFIX || ".",
  ALIVE_IMG:process.env.ALIVE_IMG||"https://i.ibb.co/Xx5Gpnrs/Purple-Blue-Illustration-Future-and-Technology-Poster.png",
  ALIVE_MSG:process.env.ALIVE_MSG || "Hello , I am alive now!!",
  MODE:process.env.MODE || "public",
  AUTO_VOICE:process.env.AUTO_VOICE|| "true",
  AUTO_STICKER:process.env.AUTO_STICKER|| "true",
  AUTO_REPLY:process.env.AUTO_REPLY|| "true",
  GEMINI_API_KEY:process.env.GEMINI_API_KEY || "AIzaSyDrhALyWLk7RN40C1sX5a03XVk8tO48P_8",
  MOVIE_API_KEY:process.env.MOVIE_API_KEY || "sky|d154108e41377cceb22ef92434509bc9081ae46b",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
};
