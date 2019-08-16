const Discord = require('discord.js');
const gamedig = require('gamedig');

const bot = new Discord.Client();

async function init() {
    try {
        await bot.login(this.token);
        let flag = false;

        bot.user.setUsername(this.name);

        process.send(`Started ${this.name}`);

        setInterval(async () => {
            try {
                console.log(`Fetching ${this.name}`);
                const server = await gamedig.query({
                    type: this.game_type,
                    host: this.ip,
                    port: parseInt(this.port)
                });
                const count = server.players.length === 0 ? server.bots.length : server.players.length;
                console.log(server);

                if (count === 0 && flag) {
                    bot.user.setPresence({
                        game: { name: `at ${server.map}`, type: "PLAYING" },
                        status: "online"
                    });
                } else {
                    bot.user.setPresence({
                        game: { name: `with ${count} ${count === 1 ? "Player" : "Players"}`, type: "PLAYING" },
                        status: "online"
                    });
                }

                flag = !flag;
            } catch (e) {
                console.log(e);
                bot.user.setPresence({
                    game: {},
                    status: "invisible"
                });
            }
        }, (this.interval || 30) * 1000);
    } catch (e) {
        process.send(`Error: ${e}`);
        process.exit();
    }
}

const config = JSON.parse(process.argv[2]);
init.apply(config);
console.log("init", config);