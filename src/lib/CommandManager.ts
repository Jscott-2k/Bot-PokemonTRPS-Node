import { Message } from 'discord.js';
import Bot from '../Bot';

type IArgument = string[] | null;
type ICmd = string[] | string;
type IBot = Bot;
export interface ICommand {
  message: Message;
  args: IArgument;
  bot:IBot;
}

export function Command(command: ICmd) {
  return function (consturctFN: Function) {
    consturctFN.prototype.command = command;
  };
}

export interface CommandManager {
  execute({ message, args, bot }: ICommand): Promise<void>;
}