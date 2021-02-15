import {Bot} from "griefergames/dist/bot";
import {createBot} from 'griefergames';
import {BootStrap} from "./index";

const owners = ["Newspicel", "ZetorZockt", "Robkiller02"]
const coinPrice = 450;

export class MinecraftBot {

    bot: Bot;
    selling: boolean = true;

    public start(bootstrap: BootStrap): void {
        this.bot = createBot({
            username: 'baylakemedion93@gmail.com',
            password: 'toshka120',
            logMessages: true,
            solveAfkChallenge: true
        });

        this.bot.init();

        this.bot.on('ready', () => {
            console.log('Der Bot ist nun bereit sich auf GrieferGames zu verbinden')
            this.bot.connectCityBuild('cb11')
                .then(() => {
                    console.log('Der Bot ist jetzt auf CB11!')
                    this.bot.sendCommand("p h Kasino").then(() => {
                        owners.forEach(value => this.bot.sendMsg(value, "Huhu ich bin jetzt ONLINE").then())
                    })
                })
        });

        this.bot.on('pay', (rank, player, amount) => {
            if (!this.selling) {
                this.bot.sendCommand("pay " + player + " " + amount).then(() => {
                    this.bot.sendCommand("msg " + player + " Aktuell ist der Verkauf geschlossen. Du hast dein Geld zurück erhalten!").then()
                })
                return
            }
            if ((amount % coinPrice) === 0) {
                const number = amount / coinPrice;
                this.bot.client.toss(371, null, number).then(() => this.bot.sendCommand("msg " + player + " Danke für deinen Einkauf :D Viel Spaß beim Zocken <3").then())
                bootstrap.discordBot.sendBuyLog(player, number)
            } else {
                this.bot.pay(player, amount).then(() => {
                    this.bot.sendCommand("msg " + player + " Du hast mir keinen Passenden Betrag gegeben ich nehme nur 450$ für 1 Token 4.000$ für 10 Tokens. Du hast dein Geld zurück erhalten!").then()
                });
            }
        });
    }
}
