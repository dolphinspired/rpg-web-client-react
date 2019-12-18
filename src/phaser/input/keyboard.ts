import keycoder from 'keycoder';

const pk = Phaser.Input.Keyboard.KeyCodes;

export class Keyboard {
  constructor(private scene: Phaser.Scene) {}

  private _buffer = new KeyboardBuffer();
  get buffer() { return this._buffer };

  init() {
    this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === pk.BACKSPACE) {
        event.preventDefault();
        this.buffer.popEvent();
      } else if (!event.ctrlKey) {
        event.preventDefault();
        this.buffer.push(event);
      }
    });
  }
}

export class KeyboardBuffer {
  private events: KeyboardEvent[] = [];
  private str: string = "";

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
      this.str = this.str.substr(0, this.str.length - 1);
    }
    return event;
  }
  popString(): string {
    if (this.events.length === 0) {
      return "";
    }
    const event = this.events.pop();
    const char = keycoder.eventToCharacter(event);
    if (char) {
      this.str = this.str.substr(0, this.str.length - 1);
    }
    return char || "";
  }
  readEvents(): KeyboardEvent[] {
    return this.events;
  }
  readString(): string {
    return this.str;
  }
  flushEvents(): KeyboardEvent[] {
    const ret = this.readEvents();
    this.reset();
    return ret;
  }
  flushString(): string {
    const ret = this.readString();
    this.reset();
    return ret;
  }

  private reset() {
    this.events = [];
    this.str = "";
  }
}
