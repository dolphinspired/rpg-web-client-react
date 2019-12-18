import keycoder from 'keycoder';

const keycodes = Phaser.Input.Keyboard.KeyCodes;

export class Keyboard {
  constructor(private scene: Phaser.Scene) {}

  private _buffer = new KeyboardBuffer();
  get buffer() { return this._buffer };

  init() {
    this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      this.buffer.push(event);
    });
  }
}

export class KeyboardBuffer {
  private keyCodes: number[] = [];
  private str: string = "";

  push(event: KeyboardEvent) {
    this.keyCodes.push(event.keyCode);
    const char = keycoder.eventToCharacter(event);
    if (char) {
      this.str += char;
    }
  }
  read(): number[] {
    return this.keyCodes;
  }
  readString(): string {
    return this.str;
  }
  flush(): number[] {
    const ret = this.read();
    this.reset();
    return ret;
  }
  flushString(): string {
    const ret = this.readString();
    this.reset();
    return ret;
  }

  private reset() {
    this.keyCodes = [];
    this.str = "";
  }
}
