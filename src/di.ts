import io from 'socket.io-client';
import { container, DependencyContainer } from 'tsyringe';

import * as c from './commands';
import * as s from './services';
import { CommandController } from './commands/core';

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

export function getResolvedCommandControllers(): CommandController[] {
  return [
    container.resolve(c.AccountController),
    container.resolve(c.SessionController),
    container.resolve(c.SocketController),
  ]
}