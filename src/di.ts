import io from 'socket.io-client';
import { inject, injectable, Container, interfaces } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import * as c from './commands';
import * as s from './services';
import { CommandController } from './commands/core';

let appContainer: Container;

type GetDecoratorsReturnType = {
  lazyInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;
  lazyInjectNamed: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>, named: string) => (proto: any, key: string) => void;
  lazyInjectTagged: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>, key: string, value: any) => (proto: any, propertyName: string) => void;
  lazyMultiInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;
};

// This allows: import { injectable, inject, tokens } from this file
export { injectable, inject, getDecorators }

export const tokens = {
  auth: 'auth',
  cmd: 'cmd',
  id: 'id',
  io: 'io',
  socket: 'socket',
  store: 'store',
};

export function getAppServicesDecorators(): GetDecoratorsReturnType {
  const container = registerAppServices();
  return getDecorators(container);
}

export function registerAppServices(): Container {
  if (appContainer) {
    // Only register app services once (static)
    return appContainer;
  }

  appContainer = new Container();

  const client = io('https://localhost:8081/', {transports: ['websocket', 'polling', 'flashsocket']});
  appContainer.bind(tokens.io).toConstantValue(client);

  appContainer.bind<s.AuthService>(tokens.auth).to(s.AuthServiceSocket);
  appContainer.bind<s.CommandService>(tokens.cmd).to(s.CommandServiceYargs).inSingletonScope();
  appContainer.bind<s.IdService>(tokens.id).to(s.IdServiceIncremental).inSingletonScope();
  appContainer.bind<s.SocketService>(tokens.socket).to(s.SocketServiceIO).inSingletonScope();
  appContainer.bind<s.ObservableStore>(tokens.store).to(s.ObservableStore).inSingletonScope();
  return appContainer;
}

export function getResolvedCommandControllers(cont: Container): CommandController[] {
  return [
    cont.resolve(c.AccountController),
    cont.resolve(c.SessionController),
    cont.resolve(c.SocketController),
  ]
}