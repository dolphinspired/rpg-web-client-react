import cookies from 'js-cookie';
import { inject, injectable } from '../di';

import { ObservableStore, SocketService } from '.';

type AuthResponse = {
  token: string;
  expires: number;
}

@injectable()
export class AuthServiceSocket implements AuthService {
  constructor(
    @inject('socket') private socket: SocketService,
    @inject('store') private store: ObservableStore,
  ) {
    // todo: abstract this away to whatever is listening for this socket message
    this.store.observe('auth').subscribe((a: AuthResponse) => {
      cookies.set('auth', a);
    });
  }

  login(user: string, pass: string) {
    this.socket.emit('login', { user, pass });
  }
  logout() {
    cookies.remove('auth');
    this.socket.emit('logout');
  }
  auth() {
    const cookie = cookies.getJSON('auth') as AuthResponse;
    if (!cookie || cookie.expires < Date.now()) {
      return;
    }
    this.socket.emit('login', { token: cookie.token });
  }
  refresh() {
    const cookie = cookies.getJSON('auth') as AuthResponse;
    this.socket.emit('refresh', { token: cookie.token });
  }
}

export interface AuthService {
  login(user: string, pass: string): void;
  logout(): void;
  auth(): void;
  refresh(): void;
}