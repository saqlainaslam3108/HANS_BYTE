const mongoose = require('mongoose');
const config = require('../config');
const EnvVar = require('./mongodbenv');

const defaultEnvVariables = [
    { key: 'ALIVE_IMG', value: 'https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(11).jpeg' },
    { key: 'ALIVE_MSG', value: 'Hello , I am alive now!!\n\n𝗧𝘆𝗽𝗲 .𝗠𝗲𝗻𝘂 𝘁𝗼 𝗴𝗲𝘁 𝗺𝗲𝗻𝘂 🥱\n\nThank you for Using Vortex MD\n\nᐯㄖ尺ㄒ乇乂 爪ᗪ 卩ㄖ山乇尺千ㄩㄥ 山卂乃ㄖㄒ\n\n🥶𝐌𝐚𝐝𝐞 𝐛𝐲 𝗣𝗮𝗻𝘀𝗶𝗹𝘂 𝗡𝗲𝘁𝗵𝗺𝗶𝗻𝗮 🥶 '},
    { key: 'PREFIX', value: '.' },
    { key: 'AUTO_READ_STATUS',value: 'true' },
];

// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB);
        console.log('🛜 MongoDB Connected ✅');

        // Check and create default environment variables
        for (const envVar of defaultEnvVariables) {
            const existingVar = await EnvVar.findOne({ key: envVar.key });

            if (!existingVar) {
                // Create new environment variable with default value
                await EnvVar.create(envVar);
                console.log(`➕ Created default env var: ${envVar.key}`);
            }
        }

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
