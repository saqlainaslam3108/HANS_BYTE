const { search, getep, dl } = require('darksadasyt-anime');
const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: "anime",
    description: "Search anime, get episodes, and download links",
    command: ["anime", "getep", "download"],
    usage: "!anime <anime name> | !getep <anime link> | !download <episode link>",
    
    async execute(sock, msg, args, command) {
        let chatId = msg.key.remoteJid;

        // Anime Search
        if (command === "anime") {
            if (!args.length) {
                return sock.sendMessage(chatId, { text: "📢 *Usage:* !anime <anime name>" }, { quoted: msg });
            }
            
            let query = args.join(" ");
            let results = await search(query);
            
            if (!results.length) {
                return sock.sendMessage(chatId, { text: "❌ No results found!" }, { quoted: msg });
            }

            let response = `🔍 *Anime Search Results for:* _${query}_\n\n`;
            results.forEach((anime, index) => {
                response += `*${index + 1}.* ${anime.title}\n🔗 Link: ${anime.link}\n\n`;
            });

            return sock.sendMessage(chatId, { text: response }, { quoted: msg });
        }

        // Get Episodes
        if (command === "getep") {
            if (!args.length) {
                return sock.sendMessage(chatId, { text: "📢 *Usage:* !getep <anime link>" }, { quoted: msg });
            }

            let animeLink = args[0];
            let results = await getep(animeLink);

            if (!results.results.length) {
                return sock.sendMessage(chatId, { text: "❌ No episodes found!" }, { quoted: msg });
            }

            let response = `🎬 *Episodes for:* _${results.result.title}_\n\n`;
            results.results.forEach((ep) => {
                response += `📺 Episode ${ep.episode} - 🔗 ${ep.url}\n`;
            });

            return sock.sendMessage(chatId, { text: response }, { quoted: msg });
        }

        // Download Episode & Send to WhatsApp
        if (command === "download") {
            if (!args.length) {
                return sock.sendMessage(chatId, { text: "📢 *Usage:* !download <episode link>" }, { quoted: msg });
            }

            let episodeLink = args[0];
            let downloadLinks = await dl(episodeLink);

            if (!downloadLinks.length) {
                return sock.sendMessage(chatId, { text: "❌ No download link found!" }, { quoted: msg });
            }

            let videoUrl = downloadLinks[downloadLinks.length - 1]; // Last link is usually the best
            let fileName = `anime_${Date.now()}.mp4`;

            sock.sendMessage(chatId, { text: "⏳ Downloading episode, please wait..." });

            try {
                const response = await axios({
                    url: videoUrl,
                    method: 'GET',
                    responseType: 'stream',
                });

                const writer = fs.createWriteStream(fileName);
                response.data.pipe(writer);

                writer.on('finish', async () => {
                    sock.sendMessage(chatId, { text: "✅ Download complete! Sending file..." });
                    await sock.sendMessage(chatId, { video: fs.readFileSync(fileName), caption: "🎬 Here is your episode!" });
                    fs.unlinkSync(fileName); // Delete after sending
                });

                writer.on('error', (err) => {
                    console.error(err);
                    sock.sendMessage(chatId, { text: "❌ Error downloading the file!" });
                });

            } catch (error) {
                console.error(error);
                sock.sendMessage(chatId, { text: "❌ Error fetching the download link!" });
            }
        }
    }
};
