const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "voiceai",
    alias: ["aivoice", "voicecmd"],
    react: "🤖",
    desc: "🔊 Convert text to AI-generated voice using custom models",
    category: "📁 Utilities",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        console.log("Received command 'voiceai' with input:", q);

        // If no query is provided
        if (!q || q.trim().length === 0) {
            const modelsList = [
                "miku", "nahida", "nami", "ana", "optimus_prime", "goku", "taylor_swift",
                "elon_musk", "mickey_mouse", "kendrick_lamar", "angela_adkinsh", "eminem"
            ];

            const exampleMessage = `❌ *No text provided for conversion.* ❌\n\n` +
                `Please use the command in the following format:\n\n` +
                `!voiceai <model> <text>\n\n` +
                `Example: !voiceai goku "Hello, this is a test!"\n\n` +
                `Available models: \n` +
                modelsList.map(model => `- ${model}`).join("\n");

            console.log("No input provided. Showing usage example.");
            return reply(exampleMessage);
        }

        // Expecting the input in the format: <model> <text>
        let [model, ...textParts] = q.trim().split(" ");
        let text = textParts.join(" ");
        console.log("Parsed model:", model, "Parsed text:", text);

        // If text is missing after the model, return the error with usage example
        if (!text || text.trim().length === 0) {
            const modelsList = [
                "miku", "nahida", "nami", "ana", "optimus_prime", "goku", "taylor_swift",
                "elon_musk", "mickey_mouse", "kendrick_lamar", "angela_adkinsh", "eminem"
            ];

            const errorMessage = `❌ *No text provided for conversion.* ❌\n\n` +
                `Please use the command in the following format:\n\n` +
                `!voiceai <model> <text>\n\n` +
                `Example: !voiceai goku "Hello, this is a test!"\n\n` +
                `Available models: \n` +
                modelsList.map(model => `- ${model}`).join("\n");

            console.log("Text missing after model. Showing usage example.");
            return reply(errorMessage);
        }

        // Build the API URL with proper encoding
        const apiUrl = `https://apis.davidcyriltech.my.id/voiceai?text=${encodeURIComponent(text)}&model=${encodeURIComponent(model)}`;
        console.log("Calling API URL:", apiUrl);
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log("API response received:", data);

        // Check if API call was successful
        if (!data.success) {
            console.log("API did not return success:", data);
            return reply("❌ *Failed to generate AI Voice.* ❌");
        }

        // Ensure audioUrl is present in the response
        if (!data.audio_url) {
            console.log("Missing audio_url in API response:", data);
            return reply("❌ *Audio URL not provided by the API.* ❌");
        }

        // Prepare the audio object for sending
        const audioObject = {
            audio: { url: data.audio_url },
            mimetype: "audio/mpeg",
            fileName: "VoiceAI-Output.mp3",
            caption: "✅ *Text converted to AI Voice successfully!* ✅"
        };

        // Log the audio object before sending
        console.log("Audio object to send:", audioObject);

        // Prepare context if needed (customizing newsletter context here)
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363292876277898@newsletter',
                newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
                serverMessageId: 143,
            },
        };

        // Attach the context info to the audio object
        audioObject.contextInfo = newsletterContext;

        // Send the media message
        await conn.sendMessage(from, audioObject, { quoted: mek });
        console.log("Message sent successfully.");

    } catch (e) {
        console.error("Error in voiceai command:", e);
        reply("❌ *An error occurred while generating AI Voice.* ❌");
    }
});
