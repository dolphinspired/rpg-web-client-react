import keycoder from 'keycoder';
import { Observable } from 'rxjs';
import { ObservableStore, IdService } from '../../services';
import { clamp } from '../util';
import { isNumber } from 'util';

const pk = Phaser.Input.Keyboard.KeyCodes;

export type KeyMatchFunction = (event: KeyboardEvent) => boolean;
export type KeyHandlerFunction = (event: KeyboardEvent) => void;

type KeyTest = {
  match: KeyMatchFunction;
  handler: KeyHandlerFunction;
}

export function key(key: number): KeyMatchFunction {
  return e => e.keyCode === key;
}

export function shift(key: number): KeyMatchFunction {
  return e => e.shiftKey && e.keyCode === key;
}

export function ctrl(key: number): KeyMatchFunction {
  return e => e.ctrlKey && e.keyCode === key;
}

export function printable(): KeyMatchFunction {
  return e => !e.ctrlKey && !!keycoder.eventToCharacter(e);
}

export class Keyboard {
  constructor(private scene: Phaser.Scene) {}

  private didInit = false;
  private tests: KeyTest[] = [];

  private init() {
    if (this.didInit) return;

    this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      this.tests.forEach(test => {
        if (test.match(event)) {
          event.preventDefault();
          test.handler(event);
        }
      })
    });
    this.didInit = true;
  }

  on(match: KeyMatchFunction | number, handler: KeyHandlerFunction) {
    this.init();
    if (isNumber(match)) {
      match = key(match);
    }
    this.tests.push({ match, handler });
  }
}

export class KeyboardBuffer {
  private store = new ObservableStore();
  private events: KeyboardEvent[] = [];
  private str: string = "";

  private flushedEvents: KeyboardEvent[][] = [];
  private flushedStr: string[] = [];

  private id = IdService.next();
  get storeBufferFlushEvents() { return `buffer-${this.id}-flush-events`; }
  get storeBufferFlushString() { return `buffer-${this.id}-flush-string`; }

  push(event: KeyboardEvent): void {
    this.events.push(event);
    const char = keycoder.eventToCharacter(event);
    if (char) {
      this.str += char;
    }
  }
  popEvent(): KeyboardEvent | undefined {
    if (this.events.length === 0) {
      return undefined;
    }
    const event = this.events.pop();
    const char = keycoder.eventToCharacter(event);
    if (char) {
      // If the popped event was a writeable char, then remove that char from the string as well
      this.str = this.str.substr(0, this.str.length - 1);
    }
    return event;
  }
  popChar(): string {
    let char = "";
    if (this.str.length === 0) {
      return char;
    }

    do {
      // Continue popping events...
      const event = this.popEvent();
      if (!event) {
        // If no events can be popped for some reason, quit immediately
        return char;
      }
      char = keycoder.eventToCharacter(event);
    } while (!char) // ...until a char can be parsed from one

    // If a char can be parsed, then popEvent has removed this char from the string
    return char;
  }
  readEvents(): KeyboardEvent[] {
    return this.events;
  }
  readString(): string {
    return this.str;
  }
  flush(): void {
    this.flushedEvents.unshift(this.events);
    this.flushedStr.unshift(this.str);
    this.store.pushValue(this.storeBufferFlushEvents, this.events);
    this.store.pushValue(this.storeBufferFlushString, this.str);
    this.clear();
  }
  clear() {
    this.events = [];
    this.str = "";
  }

  loadHistory(i: number): number {
    if (!this.flushedEvents.length) {
      return 0;
    }

    const index = clamp(i, 0, this.flushedEvents.length - 1);
    this.events = this.flushedEvents[index];
    this.str = this.flushedStr[index];

    return index;
  }

  onFlushEvents(): Observable<KeyboardEvent[]> {
    return this.store.observe(this.storeBufferFlushEvents);
  }
  onFlushString(): Observable<string> {
    return this.store.observe(this.storeBufferFlushString);
  }
}
