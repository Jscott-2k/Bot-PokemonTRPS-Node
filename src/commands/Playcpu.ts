import Game from "../Game";
import { Command, CommandManager, ICommand } from "../lib/CommandManager";

@Command("playcpu")
class Playcpu implements CommandManager {
    constructor() {
        this.execute = this.execute.bind(this);
    }
    async execute({ message, args, bot }: ICommand) {
        let game = await bot.createGameCpu(message.channel, message.author);
        if (game === undefined) {
            await message.channel.send(`Failed to create game: undefined game`);
            return;
        } else {
            bot.addGame(game);
            await message.channel.send(`Created a new game with ${message.author} and ME!`);
            await game.start(bot);
        }
    }
}
export default Playcpu;