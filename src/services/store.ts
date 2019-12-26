import { Observable, Subject } from "rxjs";
import { SocketService } from "./socket";
import { inject, injectable } from "tsyringe";

const globalSubject = 'ws-rpg';

type SubjectWithValue = {
  subject: Subject<any>;
  value?: any;
}

type SocketMessage = {
  subject: string;
  payload: any;
}

@injectable()
export class ObservableStore {
  private debug = false;
  private store = new Map<string, SubjectWithValue>();

  constructor(
    @inject('socket') private socket: SocketService
  ) {
    // Any events that the server emits to this "global subject" will be captured and re-emitted by the store
    this.socket.on(globalSubject).subscribe((m: SocketMessage) => {
      this.pushValue(m.subject, m.payload);
    });
  }

  observe<T = any>(name: string): Observable<T> {
    return this.getOrCreate(name).subject.asObservable();
  }

  getValue<T = any>(name: string): T | undefined {
    return this.getOrCreate(name).value;
  }

  pushValue(name: string, value: any): void {
    const swv = this.getOrCreate(name);
    swv.subject.next(value);
    swv.value = value;
    this.log(`pushValue('${name}')`, value);
  }

  patchValue<T = any>(name: string, patch: (value: T) => T): void {
    const swv = this.getOrCreate(name);
    const patched = patch(swv.value);
    swv.subject.next(patched);
    swv.value = patched;
    this.log(`patchValue('${name}')`, patched);
  }

  private getOrCreate(name: string): SubjectWithValue {
    let swv: SubjectWithValue;

    if (this.store.has(name)) {
      swv = this.store.get(name) as SubjectWithValue;
    } else {
      swv = { subject: new Subject<any>() }
      this.store.set(name, swv);
      this.log(`Store created for '${name}'`);
    }

    return swv;
  }

  private log(message?: any, ...optionalParams: any[]) {
    if (this.debug) {
      if (optionalParams && optionalParams.length) {
        console.log(`[Store] ${message}`, ...optionalParams)
      } else {
        console.log(`[Store] ${message}`);
      }
    }
  }
}