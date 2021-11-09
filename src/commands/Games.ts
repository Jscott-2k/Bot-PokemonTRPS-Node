import Game from "../Game";
import { Command, CommandManager, ICommand } from "../lib/CommandManager";

@Command("games")
class Test implements CommandManager {
    constructor() {
        this.execute = this.execute.bind(this);
    }
    async execute({ message, args,bot }: ICommand) {
        let gameString = "";
        bot.getActiveGames().forEach(
            (g:Game) => gameString += (g.getInfo() + '\n'));
        await message.channel.send(`List of active games:\n${gameString}`);
    }
}
export default Test;