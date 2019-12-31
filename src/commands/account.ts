import { inject, injectable } from '../di';

import { CommandArgs, CommandController, Command } from './core';
import { SocketService, AuthService } from '../services';

@injectable()
export class AccountController extends CommandController {
  constructor(
    @inject('auth') private auth: AuthService,
    @inject('socket') private socket: SocketService
  ) { super(); }

  @Command()
  signup(args: CommandArgs): void {
    const user = args.positional[1];
    const pass = args.positional[2];
    this.socket.emit('signup', { user, pass });
  }

  @Command()
  login(args: CommandArgs): void {
    const user = args.positional[1];
    const pass = args.positional[2];
    this.auth.login(user, pass);
  }

  @Command()
  logout(args: CommandArgs): void {
    this.auth.logout();
  }
}