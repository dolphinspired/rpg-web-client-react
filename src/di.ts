import io from 'socket.io-client';
import { container, DependencyContainer } from 'tsyringe';

import * as s from './services';

export const tokens = {
  auth: 'auth',
  id: 'id',
  io: 'io',
  socket: 'socket',
  store: 'store',
};

export function registerAppServices(): DependencyContainer {
  const client = io('https://localhost:8081/', {transports: ['websocket', 'polling', 'flashsocket']});
  container.register(tokens.io, { useValue: client });

  container.registerType(tokens.auth, s.AuthServiceSocket);
  container.registerType(tokens.id, s.IdServiceIncremental);
  container.registerSingleton(tokens.socket, s.SocketServiceIO);
  container.registerSingleton(tokens.store, s.ObservableStore);
  return container;
}
