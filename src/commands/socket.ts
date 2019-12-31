import { inject, injectable } from '../di';

import { CommandController, Command, CommandArgs } from './core';
import { SocketService } from '../services';

@injectable()
export class SocketController extends CommandController {
  constructor(
    @inject('socket') private socket: SocketService
  ) { super(); }

  @Command()
  sock(args: CommandArgs): void {
    const subj = args.positional[1];
    if (!subj) {
      throw new Error('Cannot send socket message - no subject specified');
    }
    this.socket.emit(subj, args);
  }
}
