import {Client, Message, MessageEmbed} from "discord.js";
import {Bot} from "griefergames/dist/bot";

let client: Client;
const prefix = "-";


export class DiscordBot {
    public listen(bot: Bot): Promise<string> {
        client = new Client();
        client.on("message", (message: Message) => {
            if (!message.content.startsWith(prefix) || message.author.bot) {
                return;
            }
            const args = message.content.slice(prefix.length).trim().split(' ');
            const command = args.shift().toLowerCase();
            switch (command) {
                case "c":
                case "command": {
                    bot.sendCommand(args.slice(0).join(' '), true).then(value => {
                        message.channel.send(new MessageEmbed()
                            .setColor('#002aff')
                            .setDescription(value)
                            .setTimestamp())
                    });
                    break
                }
            }
        })
        return client.login('ODEwNTIzMTg1ODc1MTI0MjI0.YCk4ig.7WebGLSQNcZMKRGf6fkzvXlgcEY')
    }
}
