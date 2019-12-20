import parser from 'yargs-parser';
import { SocketService } from '.';

export type CommandHandler = (args: parser.Arguments) => void;

let didInit = false;
const commandMap = new Map<string, CommandHandler>();

export class CommandService {
  private init() {
    if (didInit) return;

    this.on('sock', socket);
    didInit = true;
  }
  run(command: string): { args: parser.Arguments, error?: Error } {
    this.init();

    const args = parser(command);
    if (!args._.length) {
      return { args, error: new Error('Invalid command') }
    }

    const cmd = args._[0];
    if (!commandMap.has(cmd)) {
      return { args, error: new Error(`Unrecognized command: ${cmd}`) };
    }

    const handler = commandMap.get(cmd);
    if (!handler) {
      return { args, error: new Error(`Unrecognized command: ${cmd}`) };
    }

    try {
      handler(args);
    } catch (e) {
      if (e.message) {
        return { args, error: new Error(`An error occurred during command '${cmd}': ${e.message}`) }
      } else {
        const msg = `An unexpected error occurred during command '${cmd}'`;
        console.error(msg, e);
        return { args, error: new Error(msg) }
      }
    }

    return { args };
  }
  on(cmd: string, handler: CommandHandler) {
    commandMap.set(cmd, handler);
  }
}

function socket(args: parser.Arguments): void {
  const sock = new SocketService();
  const subj = args._[1];
  if (!subj) {
    throw new Error('Cannot send socket message - no subject specified');
  }
  sock.emit(subj, args)
}