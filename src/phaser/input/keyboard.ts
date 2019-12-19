import keycoder from 'keycoder';
import { Observable } from 'rxjs';
import { ObservableStore, IdService } from '../../services';

const pk = Phaser.Input.Keyboard.KeyCodes;

export class Keyboard {
  constructor(private scene: Phaser.Scene) {}

  private _buffer = new KeyboardBuffer();
  get buffer() { return this._buffer };

  init() {
    this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === pk.BACKSPACE) {
        event.preventDefault();
        this.buffer.popChar();
      } else if (event.keyCode == pk.ENTER) {
        event.preventDefault();
        this.buffer.flush();
      } else if (!event.ctrlKey) {
        event.preventDefault();
        this.buffer.push(event);
      }
    });
  }
}

export class KeyboardBuffer {
  private store = new ObservableStore();
  private events: KeyboardEvent[] = [];
  private str: string = "";

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
      const event = this.events.pop();
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
    this.store.pushValue(this.storeBufferFlushEvents, this.events);
    this.store.pushValue(this.storeBufferFlushString, this.str);
    this.reset();
  }

  onFlushEvents(): Observable<KeyboardEvent[]> {
    return this.store.observe(this.storeBufferFlushEvents);
  }
  onFlushString(): Observable<string> {
    return this.store.observe(this.storeBufferFlushString);
  }

  private reset() {
    this.events = [];
    this.str = "";
  }
}
