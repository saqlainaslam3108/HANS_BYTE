const axios = require('axios');

const handler = async (m, { conn, text }) => {
  if (!text) throw '✳️ Enter a Word!';

  try {
    const query = encodeURIComponent(text);
    const response = await axios.get(`https://weeb-api.vercel.app/ytsearch?query=${query}`);
    const results = response.data;

    if (!results || results.length === 0) {
      throw '❌ Not results found!';
    }

    const firstResult = results[0];

    const message = ` 
   ✏️ *VORTEX MD - YouTube Search* ✏️
📌 *Title:* ${firstResult.title}
🔗 *Link:* ${firstResult.url}
⏳ *Duration:* ${firstResult.timestamp}
📅 *Published:* ${firstResult.ago}
👀 *Views:* ${firstResult.views}
    `;

    await conn.sendMessage(m.chat, { 
      image: { url: firstResult.thumbnail }, 
      caption: message 
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    throw '🚨 Error !';
  }
};

handler.help = ['ytsearch'];
handler.tags = ['search'];
handler.command = ['ytsearch', 'yts'];

module.exports = handler;
