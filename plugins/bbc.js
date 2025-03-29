/*const axios = require('axios');
const { cmd } = require('./command');

cmd({
  pattern: 'bbcnews',
  desc: 'Get the latest BBC news.',
  react: '📰',
  use: '.bbcnews',
  category: 'News',
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
  
    const res = await axios.get('https://suhas-bro-api.vercel.app/news/bbc');
    const newsData = res.data;

    if (!newsData || newsData.length === 0) {
      return reply("❌ No news available at the moment.");
    }

   
    const article = newsData[0]; // Get the first news article

  
    let newsReply = 📰 Latest BBC News:\n\n;
    newsReply += 📅 Date: article.date;
    newsReply += 📝 Title:{article.title}\n;
    newsReply += 🗒️ Summary: article.summary;
    newsReply += 🔗 Link:{article.link}\n\n;

    
> *© 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝙱𝚢 𝚅𝙾𝚁𝚃𝙴𝚇 𝙼𝙳*

    reply(newsReply);

  } catch (error) {

console.error("Error fetching news:", error.message);
    reply("❌ An error occurred while fetching the latest news.");
  }
});
*/