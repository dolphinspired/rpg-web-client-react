import io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';

let socket: SocketIOClient.Socket;

export class SocketService {
  public init(): SocketService {
    if (!socket) {
      socket = io('https://localhost:8081/', {transports: ['websocket', 'polling', 'flashsocket']});
    }
    return this;
  }

  public emit(eventName: string, ...args: any[]): SocketService {
    if (!socket) {
      throw new Error('SocketService.emit called before init');
    }
    socket.emit(eventName, ...args);
    return this;
  }

  public on(eventName: string): Observable<any> {
    if (!socket) {
      throw new Error('SocketService.on called before init');
    }
    return fromEvent(socket, eventName);
  }

  public disconnect(): void {
    socket?.disconnect();
  }
}