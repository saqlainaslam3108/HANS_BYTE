const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { search, getep, dl } = require("darksadasyt-anime");
const axios = require("axios");
const fs = require("fs");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message || !msg.key.remoteJid) return;

        const chatId = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        const args = text.split(" ");
        const command = args.shift().toLowerCase();

        // 🎭 Anime Search
        if (command === "!anime") {
            if (!args.length) {
                return sock.sendMessage(chatId, { text: "📢 *Usage:* !anime <anime name>" });
            }

            let query = args.join(" ");
            let results = await search(query);

            if (!results.length) {
                return sock.sendMessage(chatId, { text: "❌ No results found!" });
            }

            let response = `🔍 *Anime Search Results for:* _${query}_\n\n`;
            results.forEach((anime, index) => {
                response += `*${index + 1}.* ${anime.title}\n🔗 Link: ${anime.link}\n\n`;
            });

            return sock.sendMessage(chatId, { text: response });
        }

        // 📺 Get Episodes
        if (command === "!getep") {
            if (!args.length) {
                return sock.sendMessage(chatId, { text: "📢 *Usage:* !getep <anime link>" });
            }

            let animeLink = args[0];
            let results = await getep(animeLink);

            if (!results.results.length) {
                return sock.sendMessage(chatId, { text: "❌ No episodes found!" });
            }

            let response = `🎬 *Episodes for:* _${results.result.title}_\n\n`;
            results.results.forEach((ep) => {
                response += `📺 Episode ${ep.episode} - 🔗 ${ep.url}\n`;
            });

            return sock.sendMessage(chatId, { text: response });
        }

        // 📥 Download & Send Episode
        if (command === "!download") {
            if (!args.length) {
                return sock.sendMessage(chatId, { text: "📢 *Usage:* !download <episode link>" });
            }

            let episodeLink = args[0];
            let downloadLinks = await dl(episodeLink);

            if (!downloadLinks.length) {
                return sock.sendMessage(chatId, { text: "❌ No download link found!" });
            }

            let videoUrl = downloadLinks[downloadLinks.length - 1]; // Use the last link
            let fileName = `anime_${Date.now()}.mp4`;

            sock.sendMessage(chatId, { text: "⏳ Downloading episode, please wait..." });

            try {
                const response = await axios({
                    url: videoUrl,
                    method: "GET",
                    responseType: "stream",
                });

                const writer = fs.createWriteStream(fileName);
                response.data.pipe(writer);

                writer.on("finish", async () => {
                    sock.sendMessage(chatId, { text: "✅ Download complete! Sending file..." });
                    await sock.sendMessage(chatId, { video: fs.readFileSync(fileName), caption: "🎬 Here is your episode!" });
                    fs.unlinkSync(fileName); // Delete after sending
                });

                writer.on("error", (err) => {
                    console.error(err);
                    sock.sendMessage(chatId, { text: "❌ Error downloading the file!" });
                });

            } catch (error) {
                console.error(error);
                sock.sendMessage(chatId, { text: "❌ Error fetching the download link!" });
            }
        }
    });
}

startBot();
