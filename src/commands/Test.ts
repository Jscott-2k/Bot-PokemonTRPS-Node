import { Command, CommandManager, ICommand } from "../lib/CommandManager";

@Command("test")
class Test implements CommandManager {
  constructor() {
    this.execute = this.execute.bind(this);
  }
  async execute({ message, args,bot }: ICommand) {
    await message.reply('zzzzzzzzzzzz');
  }
}
export default Test;