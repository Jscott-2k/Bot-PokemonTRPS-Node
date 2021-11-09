import Game from "../Game";
import { Command, CommandManager, ICommand } from "../lib/CommandManager";

@Command("play")
class Play implements CommandManager {
    constructor() {
        this.execute = this.execute.bind(this);
    }
    async execute({ message, args, bot }: ICommand) {
        let otherPlayer = await message.mentions.users.first();
        let game = await bot.createGame(message.channel, otherPlayer, message.author);
        if (game === undefined) {
            await message.channel.send(`Failed to create game: undefined game`);
            return;
        } else {
            bot.addGame(game);
            await message.channel.send(`Created a new game with ${args?.at(0)} and ${message.author}`);
            await game.start(bot);
        }
    }
}
export default Play;