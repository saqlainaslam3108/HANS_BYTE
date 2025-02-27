const axios = require('axios');

// Command for downloading Facebook videos
const downloadFacebookVideo = async (m, args) => {
    if (!args[0]) {
        return m.reply("Please provide a Facebook video URL.");
    }

    const videoUrl = args[0];

    try {
        // Call the API to fetch the download link
        const response = await axios.get(`https://dark-shan-yt.koyeb.app/download/facebook?url=${encodeURIComponent(videoUrl)}`);

        // Check if the response contains the video download URL
        if (response.data && response.data.result) {
            const videoDownloadUrl = response.data.result;

            // Send the video download link to the user
            m.reply(`Here is the HD Facebook video download link: ${videoDownloadUrl}`);
        } else {
            m.reply("Sorry, I couldn't find a valid download link for this video.");
        }
    } catch (error) {
        console.error(error);
        m.reply("There was an error fetching the video. Please try again later.");
    }
};

// Add this function to your bot's command handler
bot.on('message', (m) => {
    if (m.body.startsWith('!upload')) {
        const args = m.body.split(' ').slice(1);
        downloadFacebookVideo(m, args);
    }
});
