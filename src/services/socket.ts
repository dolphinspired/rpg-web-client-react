import io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';

export class SocketService {
  public socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

  public init(): SocketService {
    this.socket = io('https://localhost:8081/', {transports: ['websocket', 'polling', 'flashsocket']});
    return this;
  }

  public on(eventName: string): Observable<any> {
    return fromEvent(this.socket, eventName);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}