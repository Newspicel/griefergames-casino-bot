import {Bot} from "griefergames/dist/bot";
import {createBot} from 'griefergames';
import {BootStrap} from "./index";
import {DMChannel, NewsChannel, TextChannel} from "discord.js";
import {jsonToCodedText, stripCodes} from "griefergames/dist/util/minecraftUtil";

const owners = ["Newspicel", "Robkiller02"]
const coinPrice = 400;

export class MinecraftBot {

    bot: Bot;
    selling: boolean = true;

    public start(bootstrap: BootStrap): void {
        this.bot = createBot({
            username: '',
            password: '',
            logMessages: false,
            solveAfkChallenge: true,

        });

        this.bot.init();

        this.bot.on('ready', () => {
            console.log('Der Bot ist nun bereit sich auf GrieferGames zu verbinden')
            this.bot.connectCityBuild('cb11')
                .then(() => {
                    console.log('Der Bot ist jetzt auf CB11!')
                    this.bot.sendCommand("p h Kasino").then(() => {
                        owners.forEach(value => this.bot.sendMsg(value, "Ich bin jetzt online!").then())
                        this.bot.sendCommand("home kasino").then();
                        const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>bootstrap.discordBot.client.channels.cache.get('811244169972154410'));
                        bootstrap.discordBot.sendEmbed(channel, "GREEN", "Ich bin wieder online. Mit /p h Kasino könnt ihr wieder bei mir einkaufen.")
                        this.bot.sendChat("&3Huhu, ich, der Kasino Bot von /p h Kasino auf CB11, ist wieder da!").then()
                        this.bot.sendChat(".").then()
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
                }).catch(() => {
                    this.bot.sendCommand("msg " + player + " Ich habe leider keine Münzen mehr :D Versuche es später erneut <3");
                    const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>bootstrap.discordBot.client.channels.cache.get('814868818806439977'));
                    bootstrap.discordBot.sendEmbed(channel, "#ff0000", 'Ich habe keine Tokens mehr!');
                })
            }else {
                if ((amount % coinPrice) === 0) {
                    const number = amount / coinPrice;
                    this.bot.client.toss(371, null, number).then(() => {
                        this.bot.sendCommand("msg " + player + " Danke für deinen Einkauf :D Viel Spaß beim Zocken <3");
                        bootstrap.discordBot.sendBuyLog(player, number);
                    }).catch(() => {
                        this.bot.sendCommand("msg " + player + " Ich habe leider keine Tokens mehr :D Versuche es später erneut <3");
                        const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>bootstrap.discordBot.client.channels.cache.get('814868818806439977'));
                        bootstrap.discordBot.sendEmbed(channel, "#ff0000", 'Ich habe keine Tokens mehr!');
                    })
                } else {
                    this.bot.pay(player, amount).then(() => {
                        this.bot.sendCommand("msg " + player + " Du hast mir keinen Passenden Betrag gegeben ich nehme nur 400$ für 1 Token oder 25.000$ für 64 Tokens. Du hast dein Geld zurück erhalten!").then(value => {
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
            bootstrap.discordBot.sendMessage(channel, text).catch(() => {})
        });

        this.bot.on('itemClearAlert', (seconds: number) => {
            this.sendPlotChatMessage("&4In &c"  + (seconds == 1 ? "einer Sekunde" : ( seconds + " Sekunden")) + " &4ist Itemclear. Bitte mit dem Spielen aufhören.")
        })
    }

    public sendPlotChatMessage(s: string) : void {
        this.bot.sendCommand("plot chat").then( () =>
            this.bot.sendChat(s, true).then( () =>
                this.bot.sendCommand("plot chat", true).then()
            )
        )
    }
}
