import { fromEvent, Observable } from 'rxjs';
import { inject, injectable } from '../di';

@injectable()
export class SocketServiceIO implements SocketService {
  constructor(
    @inject('io') private client: SocketIOClient.Socket
  ) { }

  emit(eventName: string, ...args: any[]): SocketService {
    this.client.emit(eventName, ...args);
    return this;
  }

  on(eventName: string): Observable<any> {
    return fromEvent(this.client, eventName);
  }

  disconnect(): void {
    this.client.disconnect();
  }
}

export interface SocketService {
  emit(eventName: string, ...args: any[]): SocketService;
  on(eventName: string): Observable<any>;
  disconnect(): void;
}