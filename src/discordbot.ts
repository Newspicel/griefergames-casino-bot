import {Client, ColorResolvable, DMChannel, Message, MessageEmbed, NewsChannel, TextChannel} from "discord.js";
import {BootStrap} from "./index";

const prefix = "-";

export class DiscordBot {

    client: Client;

    public start(bootStrap: BootStrap): void {
        this.client = new Client();
        this.client.on("message", (message: Message) => {
            if (!message.content.startsWith(prefix) || message.author.bot) {
                return;
            }
            const args = message.content.slice(prefix.length).trim().split(' ');
            const command = args.shift().toLowerCase();
            switch (command) {
                case "c":
                case "command": {
                    bootStrap.minecraftBot.bot.sendCommand(args.slice(0).join(' '), true).then(value => this.sendEmbed(message.channel, '#002aff', value));
                    break
                }
                case "selling": {
                    if (bootStrap.minecraftBot.selling) {
                        bootStrap.minecraftBot.selling = false;
                        message.channel.send("Die Verkaufe wurden nun deaktiviert").then()
                    } else {
                        bootStrap.minecraftBot.selling = true;
                        message.channel.send("Die Verkaufe wurden nun aktiviert").then()
                    }
                    break;
                }
            }
        })
        this.client.login('ODEwNTIzMTg1ODc1MTI0MjI0.YCk4ig.7WebGLSQNcZMKRGf6fkzvXlgcEY').then()
    }

    public sendEmbed(channel: TextChannel | DMChannel | NewsChannel, color: ColorResolvable, description: String): Promise<Message> {
        return channel.send(new MessageEmbed().setColor(color).setDescription(description).setTimestamp());
    }

    public sendMessage(channel: TextChannel | DMChannel | NewsChannel, message: string): Promise<Message> {
        return channel.send(message);
    }

    public sendEmbedWithTitle(channel: TextChannel | DMChannel | NewsChannel, color: ColorResolvable, title: String, description: String): Promise<Message> {
        return channel.send(new MessageEmbed().setColor(color).setDescription(description).setTitle(title).setTimestamp());
    }

    public sendBuyLog(player: String, many: number) {
        const channel: TextChannel | DMChannel | NewsChannel = (<TextChannel | DMChannel | NewsChannel>this.client.channels.cache.get('810530211295789057'));
        this.sendEmbed(channel, '#46ff00', "Der Spieler " + player + " hat sich " + many + " Tokens gekauft!").then()
    }

}
