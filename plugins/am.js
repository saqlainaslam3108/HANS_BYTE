const { cmd } = require("../command");
const { Anime } = require('@shineiichijo/marika');
const { translate } = require('@vitalets/google-translate-api');

const client = new Anime();

cmd(
  {
    pattern: "anime2",
    react: "🎬",
    desc: "Search and Get Anime Information",
    category: "anime",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
      if (!q) return reply("*[❗] Please provide the name of an anime to search for.* 🎬");

      // Search for the anime
      let anime = await client.searchAnime(q);
      let result = anime.data[0];

      // Translate background and synopsis
      let resultes = await translate(result.background, { to: 'en', autoCorrect: true });
      let resultes2 = await translate(result.synopsis, { to: 'hi', autoCorrect: true });

      let AnimeInfo = `
🎀 • *Title:* ${result.title}
🎋 • *Format:* ${result.type}
📈 • *Status:* ${result.status.toUpperCase().replace(/\_/g, ' ')}
🍥 • *Total Episodes:* ${result.episodes || 'N/A'}
🎈 • *Duration:* ${result.duration || 'N/A'}
✨ • *Based on:* ${result.source.toUpperCase()}
💫 • *Released:* ${result.aired.from || 'N/A'}
🎗 • *Finished:* ${result.aired.to || 'N/A'}
🎐 • *Popularity:* ${result.popularity || 'N/A'}
🎏 • *Favorites:* ${result.favorites || 'N/A'}
🎇 • *Rating:* ${result.rating || 'N/A'}
🏅 • *Rank:* ${result.rank || 'N/A'}
♦ • *Trailer:* ${result.trailer?.url || 'N/A'}
🌐 • *URL:* ${result.url}
🎆 • *Background:* ${resultes.text}
❄ • *Synopsis:* ${resultes2.text}
`;

      let imageUrl = result.images?.jpg?.image_url || 'https://via.placeholder.com/500x700?text=No+Image';

      // Send image with anime information
      await robin.sendMessage(
        from,
        { image: { url: imageUrl }, caption: AnimeInfo },
        { quoted: mek }
      );

      reply("*Thanks for using the Anime Info feature!* 🎬");
    } catch (error) {
      console.error(error);
      reply(`❌ *Error occurred, please try again.*`);
    }
  }
);
