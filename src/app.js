const config = require('config');
const { fork } = require('child_process');

const bots = config.get('bots');

function init() {
    for (let i in bots) {
        startBot(i, bots[i]);
    }
}

function startBot(id, bot) {
    const process = fork('src/bot.js', [
        `${JSON.stringify(bot)}`
    ]);

    console.log(`[MAIN] Started bot ${id}`);

    process.on('message', (data) => {
        console.log(`[BOT${id}] ${typeof data === 'object' ? JSON.stringify(data) : data}`);
    });

    process.on('close', (signal) => {
        console.log(`[BOT${id}] Closed with signal: ${signal}`);

        console.log(`[MAIN] Attempting to restart bot ${id}`);

        if (process.connected) {
            process.disconnect();
        }

        setTimeout(() => {
            startBot(id, bot);
        }, 5 * 1000);
    });
}

module.exports = {
    init
};