const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "qjRz1BoS#C5SJPfDeF2wJ3m4KrVlWFPoDoQECaJAhp2IYDT0AjEY",
  MONGODB: process.env.MONGODB || "mongodb://mongo:vXILNtmpUbvOJCqUvqjlGAvEbyLLfZjk@mongodb.railway.internal:27017",
  OWNER_NUM: process.env.OWNER_NUM || "94763513529",
};
