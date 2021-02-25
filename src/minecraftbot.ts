import {Bot} from "griefergames/dist/bot";
import {createBot} from 'griefergames';
import {BootStrap} from "./index";
import {DMChannel, NewsChannel, TextChannel} from "discord.js";
import {jsonToCodedText, stripCodes} from "griefergames/dist/util/minecraftUtil";

const owners = ["Newspicel", "ZetorZockt", "Robkiller02"]
const coinPrice = 400;

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
                        this.bot.sendCommand("home kasino").then();
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
            if (amount === 25000){
                this.bot.client.toss(371, null, 64).then(() => {
                    this.bot.sendCommand("msg " + player + " Danke für deinen Einkauf :D Viel Spaß beim Zocken <3");
                    bootstrap.discordBot.sendBuyLog(player, 64);
                    owners.forEach(value => this.bot.sendMsg(value, player + " Hat sich 64 Tokens gekauft!").then())
                }).catch((error) => {
                    this.bot.sendCommand("msg " + player + " Ich habe leider keine Münzen mehr :D Versuche es später erneut <3");
                    const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>bootstrap.discordBot.client.channels.cache.get('810530211295789057'));
                    bootstrap.discordBot.sendEmbed(channel, "#ff0000", 'Ich habe keine Items mehr!');
                })
            }else {
                if ((amount % coinPrice) === 0) {
                    const number = amount / coinPrice;
                    this.bot.client.toss(371, null, number).then(() => {
                        this.bot.sendCommand("msg " + player + " Danke für deinen Einkauf :D Viel Spaß beim Zocken <3");
                        bootstrap.discordBot.sendBuyLog(player, number);
                        owners.forEach(value => this.bot.sendMsg(value, player + " Hat sich "+ number + " Tokens gekauft!").then())
                    }).catch((error) => {
                        this.bot.sendCommand("msg " + player + " Ich habe leider keine Münzen mehr :D Versuche es später erneut <3");
                        const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>bootstrap.discordBot.client.channels.cache.get('810530211295789057'));
                        bootstrap.discordBot.sendEmbed(channel, "#ff0000", 'Ich habe keine Items mehr!');
                    })
                } else {
                    this.bot.pay(player, amount).then(() => {
                        this.bot.sendCommand("msg " + player + " Du hast mir keinen Passenden Betrag gegeben ich nehme nur 450$ für 1 Token 4.000$ für 10 Tokens. Du hast dein Geld zurück erhalten!").then(value => {
                            const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>bootstrap.discordBot.client.channels.cache.get('810530211295789057'));
                            bootstrap.discordBot.sendEmbed(channel, "#ff0000", 'Der Spieler '+player+' mit dem Rang '+rank+' wollte sich etwas für '+ amount+'$ kaufen! Jedoch habe ich kein passendes Produkt gefunden!');
                        })
                    });
                }
            }
        });

        this.bot.on('msg', (rank, player, message) => {
            const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>bootstrap.discordBot.client.channels.cache.get('810530298823180358'));
            bootstrap.discordBot.sendEmbed(channel, "#ff0000", 'Der Spieler '+player+' mit dem Rang '+rank+' hat mir eine MSG gesendet! || '+ message);
        })

        this.bot.client.on('message', (message: any) => {
                const codedText = jsonToCodedText(message.json).trim();
                const text = stripCodes(codedText);
            const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>bootstrap.discordBot.client.channels.cache.get('814533495350231100'));
            bootstrap.discordBot.sendMessage(channel, text);
        });
    }
}
