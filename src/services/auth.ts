import cookies from 'js-cookie';

import { ObservableStore, SocketService } from '.';

let didInit = false;
let store: ObservableStore;
let socket: SocketService;

type AuthResponse = {
  token: string;
  expires: number;
}

function init() {
  if (didInit) return;
  socket = new SocketService();
  store = new ObservableStore();
  store.observe('auth').subscribe((a: AuthResponse) => {
    cookies.set('auth', a);
  });
  didInit = true;
}

export class AuthService {
  login(user: string, pass: string) {
    init();
    socket.emit('login', { user, pass });
  }
  logout() {
    init();
    cookies.remove('auth');
    socket.emit('logout');
  }
  auth() {
    init();
    const cookie = cookies.getJSON('auth') as AuthResponse;
    if (cookie.expires < Date.now()) {
      return;
    }
    socket.emit('login', { token: cookie.token });
  }
  refresh() {
    init();
    const cookie = cookies.getJSON('auth') as AuthResponse;
    socket.emit('refresh', { token: cookie.token });
  }
}