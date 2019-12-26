import { inject, injectable } from "tsyringe";

import { CommandController, CommandArgs, Command } from "./core";
import { SocketService } from "../services";

@injectable()
export class SessionController extends CommandController {
  constructor(
    @inject('socket') private socket: SocketService
  ) { super(); }

  @Command('open')
  opensession(args: CommandArgs): void {
    const sessionId = args.positional[1];
    const boardId = args.positional[2];
    const userId = args.positional[3];
    this.socket.emit('open-session', { sessionId, boardId, userId });
  }

  @Command('close')
  closesession(args: CommandArgs): void {
    const sessionId = args.positional[1];
    this.socket.emit('close-session', { sessionId });
  }

  @Command('join')
  joinsession(args: CommandArgs): void {
    const sessionId = args.positional[1];
    const userId = args.positional[2];
    this.socket.emit('join-session', { sessionId, userId });
  }

  @Command('leave')
  leavesession(args: CommandArgs): void {
    this.socket.emit('leave-session');
  }
}

