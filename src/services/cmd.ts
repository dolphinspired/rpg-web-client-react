import parser from 'yargs-parser';

import { injectable } from '../di';
import { CommandHandlerFunction, CommandArgs } from '../commands/core';

function toCommandArgs(yargs: parser.Arguments): CommandArgs {
  const cmd = yargs._[0];
  const positional = yargs._;

  // Clean up the "default" properties from the yargs object
  const named = Object.assign({}, yargs);
  delete named._;
  delete named.$0;

  return { cmd, positional, named };
}

@injectable()
export class CommandServiceYargs implements CommandService {
  private commandMap = new Map<string, CommandHandlerFunction>();

  run(command: string): void {
    const yargs = parser(command);
    if (!yargs._.length) {
      throw new Error('Invalid command');
    }

    const args = toCommandArgs(yargs);
    const handler = this.commandMap.get(args.cmd);
    if (!handler) {
      throw new Error(`Unrecognized command: ${args.cmd}`);
    }

    try {
      handler(args);
    } catch (e) {
      if (e.message) {
        throw new Error(`An error occurred during command '${args.cmd}': ${e.message}`);
      } else {
        const msg = `An unexpected error occurred during command '${args.cmd}'`;
        console.error(msg, e);
        throw new Error(msg);
      }
    }
  }
  on(cmd: string, handler: CommandHandlerFunction) {
    this.commandMap.set(cmd, handler);
  }
}

export interface CommandService {
  run(cmd: string): void;
  on(cmd: string, handler: CommandHandlerFunction): void;
}