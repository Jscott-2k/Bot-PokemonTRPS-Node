import Game from "../Game";
import { Command, CommandManager, ICommand } from "../lib/CommandManager";

@Command("type")
class Type implements CommandManager {
    constructor() {
        this.execute = this.execute.bind(this);
    }
    async execute({ message, args, bot }: ICommand) {
        let type = await Game.GetTypeData(args?.at(0) as string, bot);
        await message.channel.send(`Type:\n${type}`);
    }
}
export default Type;