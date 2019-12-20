import parser from 'yargs-parser';

export type CommandHandler = (args: parser.Arguments) => void;

const commandMap = new Map<string, CommandHandler>();

export class CommandService {
  run(cmd: string): { args: parser.Arguments, found: boolean } {
    let found = false;
    const args = parser(cmd);
    if (!args._.length || !commandMap.has(args._[0])) return { args, found };
    const handler = commandMap.get(args._[0]);
    if (!handler) return { args, found };
    found = true;
    handler(args);
    return { args, found };
  }
  on(cmd: string, handler: CommandHandler) {
    commandMap.set(cmd, handler);
  }
}
