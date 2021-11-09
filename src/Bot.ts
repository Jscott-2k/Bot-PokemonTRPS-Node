require('dotenv').config();
import { CronJob } from "cron"

import { TextBasedChannels, MessageMentions, Client, Intents, Interaction, MemberMention, Message, MessagePayload, MessageReaction, Snowflake, User, TextChannel, Collection } from "discord.js";
import Game from "./Game"
import { readdirSync } from 'fs';
import { ICommand } from "./lib/CommandManager";

const prefix = "!";

export default class Bot extends Client {

    private clearGamesJob: CronJob | undefined;
    private activeGames: Array<Game> = [];
    private commands = new Collection<string, Function>();

    constructor() {
        super({ "shards": "auto", intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
        this.addListener("ready", this.ready.bind(this));
        this.addListener("shardReady", this.shardReady.bind(this));
        this.addListener("messageReactionAdd", this.messageReactionAdd.bind(this));
        this.addListener("messageCreate", this.messageCreate.bind(this));
        this.initCommands();
    }
    public getActiveGames(): Array<Game> {
        return this.activeGames;
    }
    private initCommands() {
        try {
            const cmdFiles = readdirSync(`./src/commands`).filter((file) =>
                file.endsWith('.ts')
            );
            for (const file of cmdFiles) {
                console.log(`Importing command ${file}`);
                
                const commandClass = require(`./commands/${file}`).default;
                if (commandClass === undefined) { continue; }
                const { command, execute } = new commandClass();
                if (typeof command === 'string') {
                this.commands.set(command, execute);
                continue;
                }
                for (const cmd of command) {
                    this.commands.set(cmd, execute);
                }
            }
        }catch(error){
            console.error(error);
        }
    }

    private purgeInactiveGames() {
        console.log(`Purging Inactive Games... ${this.activeGames}`);

        if (!this.activeGames.length) {
            console.log("No games found to purge!");
            return;
        }

        let totalGames = this.activeGames.length;
        this.activeGames = this.activeGames.filter((v) => {
            return !v.isFinished();
        });
        console.log(`Done purging... ${totalGames - this.activeGames.length} games removed!`);
    }

    private async ready(client: Client) {
        console.info(`Bot is ready!`);
        this.clearGamesJob = new CronJob('*/30 * * * * *', this.purgeInactiveGames.bind(this));
        this.clearGamesJob.start();
    }

    private async shardReady(id: number, unavailableGuilds: Set<Snowflake>) {
        console.info(`Bot shard ${id} is ready!`);
    }

    private async handleCommand(message: Message, cmd: string, args: Array<string>, mentions: MessageMentions) {
        console.info(`Processing command:${cmd} args:${args} mentions:${mentions.toJSON()}`);
        try {
            const func = this.commands.get(cmd) || function () { };
            const execParams: ICommand = {
                message: message,
                args: args,
                bot: this
            }
            await func(execParams);
        } catch (err) {
            console.error(err);
            message.reply('An error occurred while processing the command.');
        }
    }

    private async messageCreate(message: Message) {
        if (message.author.bot || message.author == this.user) return;
        if (message.content.startsWith(prefix)) {
            const [cmd, ...args] = message.content.trim().substring(prefix.length).split(/\s+/);
            this.handleCommand(message, cmd, args, message.mentions);
        }
    }
    private async messageReactionAdd(messageReaction: MessageReaction) {
        if (!messageReaction.me) {
            console.log("Reaction added from User!");
        }

    }
    public createGame(textChannel: TextBasedChannels, userA?: User, userB?: User): Game | undefined {
        if (userA === undefined || userB === undefined) {
            return undefined;
        }
        return new Game(userA, userB, textChannel);
    }
    public createGameCpu(textChannel: TextBasedChannels, userB: User): Game {
        return new Game(this.user, userB, textChannel, true);
    }
    public addGame(game: Game) {
        this.activeGames.push(game);
    }
    public static async run() {
        await new Bot().login(process.env.DISCORD_BOT_TOKEN);
    }
}
