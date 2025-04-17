const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const fs = require("fs");
const { runtime } = require('../lib/functions');
const { exec } = require("child_process");

cmd({
    pattern: "system",
    alias: ["status", "botinfo"],
    desc: "Check bot system details, RAM, CPU, disk usage, uptime, and more",
    category: "main",
    react: "💻",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // System information
        const cpu = os.cpus()[0]; // First CPU core details
        const cpuUsage = os.loadavg()[0].toFixed(2); // 1-minute load average
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2); // Total memory in MB
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);
        const nodeVersion = process.version;
        const osType = os.type();
        const osRelease = os.release();
        const osArch = os.arch();
        const botUptime = runtime(process.uptime()); // Bot uptime
        const sysUptime = runtime(os.uptime()); // System uptime
        const cpuSpeed = cpu.speed; // CPU speed in MHz
        const processId = process.pid; // Bot's process ID
        const processCount = os.loadavg()[1].toFixed(2); // Average processes running

        // Asynchronously get disk space info (Linux/macOS only)
        let diskUsage = "N/A";
        try {
            diskUsage = await new Promise((resolve, reject) => {
                exec("df -h / | tail -1 | awk '{print $3 \" used / \" $2 \" total\"}'", (error, stdout, stderr) => {
                    if (error) {
                        console.error("Disk usage check failed:", error);
                        return resolve("N/A");
                    }
                    resolve(stdout.toString().trim());
                });
            });
        } catch (e) {
            console.log("Disk usage check failed.");
        }

        // Get network interface
        const networkInterfaces = os.networkInterfaces();
        let networkInfo = "N/A";
        for (let key in networkInterfaces) {
            if (networkInterfaces[key][0] && networkInterfaces[key][0].address) {
                networkInfo = `${key}: ${networkInterfaces[key][0].address}`;
                break;
            }
        }

        // Create a fancy status string using cool fonts and extra special characters
        let status = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ⏰ *𝓑𝓸𝓽 𝓤𝓹𝓽𝓲𝓶𝓮:* ${botUptime}
┃  🖥️ *𝓢𝔂𝓼𝓽𝓮𝓶 𝓤𝓹𝓽𝓲𝓶𝓮:* ${sysUptime}
┃  📟 *𝓡𝓐𝓜 𝓤𝓼𝓪𝓰𝓮:* ${usedMem}MB / ${totalMem}MB
┃  🆓 *𝓕𝓻𝓮𝓮 𝓡𝓐𝓜:* ${freeMem}MB
┃  ⚡ *𝓒𝓟𝓤 𝓜𝓸𝓭𝓮𝓵:* ${cpu.model}
┃  🚀 *𝓒𝓟𝓤 𝓢𝓹𝓮𝓮𝓭:* ${cpuSpeed} MHz
┃  📊 *𝓒𝓟𝓤 𝓤𝓼𝓪𝓰𝓮:* ${cpuUsage}%
┃  🏷️ *𝓞𝓢 𝓣𝔂𝓹𝓮:* ${osType} (${osArch})
┃  🔄 *𝓞𝓢 𝓥𝓮𝓻𝓼𝓲𝓸𝓷:* ${osRelease}
┃  💾 *𝓓𝓲𝓼𝓴 𝓤𝓼𝓪𝓰𝓮:* ${diskUsage}
┃  🌐 *𝓝𝓮𝓽𝔀𝓸𝓻𝓴:* ${networkInfo}
┃  🏷️ *𝓐𝓬𝓽𝓲𝓿𝓮 𝓟𝓻𝓸𝓬𝓮𝓼𝓼𝓮𝓼:* ${processCount}
┃  🔢 *𝓑𝓸𝓽 𝓟𝓘𝓓:* ${processId}
┃  ⚙️ *𝓝𝓸𝓭𝓮.𝓳𝓼 𝓥𝓮𝓻𝓼𝓲𝓸𝓷:* ${nodeVersion}
┃  👨‍💻 *𝓓𝓮𝓿𝓮𝓵𝓸𝓹𝓮𝓻:* Hans Tech
┃  🧬 *𝓑𝓸𝓽 𝓥𝓮𝓻𝓼𝓲𝓸𝓷:* 1.0.0
┃  ✞ *𝓞𝔀𝓷𝓮𝓻:* ${config.OWNER_NAME || "Unknown"}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

       𓆩 𝒑𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝒉𝒂𝒏𝒔 𝒃𝒚𝒕𝒆 𓆪`;

        // Send image with system info as caption
        return await conn.sendMessage(from, { 
            image: { url: "https://i.ibb.co/FLSgNhW9/Free.png" }, 
            caption: status 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

