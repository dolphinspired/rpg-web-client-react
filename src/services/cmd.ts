import parser from 'yargs-parser';
import { SocketService, AuthService } from '.';

export type CommandHandler = (args: parser.Arguments) => void;

let didInit = false;
const commandMap = new Map<string, CommandHandler>();

let sock: SocketService;
let authService: AuthService;

export class CommandService {
  private init() {
    if (didInit) return;
    sock = new SocketService();
    authService = new AuthService();
    this.on('sock', socket);
    this.on('open', opensession);
    this.on('close', closesession);
    this.on('join', joinsession);
    this.on('leave', leavesession);
    this.on('signup', signup);
    this.on('login', login);
    this.on('logout', logout);
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
  const subj = args._[1];
  if (!subj) {
    throw new Error('Cannot send socket message - no subject specified');
  }
  sock.emit(subj, args)
}

function opensession(args: parser.Arguments): void {
  const sessionId = args._[1];
  const boardId = args._[2];
  const userId = args._[3];
  sock.emit('open-session', { sessionId, boardId, userId });
}

function closesession(args: parser.Arguments): void {
  const sessionId = args._[1];
  sock.emit('close-session', { sessionId });
}

function joinsession(args: parser.Arguments): void {
  const sessionId = args._[1];
  const userId = args._[2];
  sock.emit('join-session', { sessionId, userId });
}

function leavesession(args: parser.Arguments): void {
  sock.emit('leave-session');
}

function signup(args: parser.Arguments): void {
  const user = args._[1];
  const pass = args._[2];
  sock.emit('signup', { user, pass });
}

function login(args: parser.Arguments): void {
  const user = args._[1];
  const pass = args._[2];
  authService.login(user, pass);
}

function logout(args: parser.Arguments): void {
  authService.logout();
}