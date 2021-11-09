import Game from "../Game";
import { Command, CommandManager, ICommand } from "../lib/CommandManager";

@Command("types")
class Types implements CommandManager {
    constructor() {
        this.execute = this.execute.bind(this);
    }
    async execute({ message, args, bot }: ICommand) {
        let types = await Game.GetPokemonTypes();
        await message.channel.send(`Types:\n${types}`);
    }
}
export default Types;