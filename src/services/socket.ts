import io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';

let socket: SocketIOClient.Socket;

function init() {
  if (!socket) {
    socket = io('https://localhost:8081/', {transports: ['websocket', 'polling', 'flashsocket']});
  }
}

export class SocketService {
  public emit(eventName: string, ...args: any[]): SocketService {
    init();
    socket.emit(eventName, ...args);
    return this;
  }

  public on(eventName: string): Observable<any> {
    init();
    return fromEvent(socket, eventName);
  }

  public disconnect(): void {
    socket?.disconnect();
  }
}