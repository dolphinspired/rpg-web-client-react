import { Keyboard, key, printable, KeyboardBuffer } from '../input/keyboard';

const pk = Phaser.Input.Keyboard.KeyCodes;

export class Chatbox {
  public bufferSize = 10;
  public lineSpacing = 2;
  public fontSize = 12;
  public xPadding = 10;
  public yPadding = 10;

  private scene: Phaser.Scene;
  private keyboard: Keyboard;
  private buffer: KeyboardBuffer;

  private font = { fontFamily: "Courier New, sans-serif", fontSize: this.fontSize + "px", color: "#FFFFFF" };
  private userInput?: Phaser.GameObjects.Text;
  private messages: Phaser.GameObjects.Text[] = [];
  private newMessages: { timestamp: number, message: string }[] = [];

  private currentTime: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.keyboard = new Keyboard(scene);
    this.buffer = new KeyboardBuffer();
    this.currentTime = Date.now();
  }
  create() {
    const lp = this.getLinePos(1);
    this.userInput = this.scene.add.text(lp.x, lp.y, "", this.font);

    this.keyboard.on(key(pk.BACKSPACE), () => this.buffer.popChar());
    this.keyboard.on(key(pk.ENTER), () => this.buffer.flush());
    this.keyboard.on(printable(), (e: KeyboardEvent) => this.buffer.push(e));
    this.buffer.onFlushString().subscribe((str: string) => {
      if (!str) return;
      this.push(`[Command] ${str}`);
    });
  }
  update() {
    this.currentTime = Date.now();

    // Write the current keyboard input buffer (user input) to the bottom line
    if (this.userInput) {
      this.userInput.text = this.buffer.readString();
      this.userInput.update();
    }

    const updated = this.newMessages.length > 0;

    if (updated) {
      const ts = new Date(this.currentTime).toLocaleTimeString();
      this.newMessages.forEach(m => {
        this.messages.unshift(this.scene.add.text(0, 0, `[${ts}] ${m.message}`, this.font));
      });
      this.newMessages = [];

      // Trim message list to be no longer than buffer size
      this.trimMessagesToSize(this.bufferSize);

      // Adjust message display coords such that the newest messages appear on the bottom
      let i = 2;
      this.messages.forEach(text => {
        const pos = this.getLinePos(i++);
        text.x = pos.x;
        text.y = pos.y;
        text.update();
      });
    }
  }
  push(message: string) {
    this.newMessages.push({ timestamp: this.currentTime, message });
  }
  clear() {
    this.newMessages = [];
    this.trimMessagesToSize(0);
  }
  private getLinePos(line: number): { x: number, y: number } {
    const yLineStart = this.scene.game.scale.height - this.yPadding;
    const yLineDiff = line * (this.fontSize + this.lineSpacing);
    return { x: this.xPadding, y: yLineStart - yLineDiff };
  }
  private trimMessagesToSize(numLines: number) {
    while (this.messages.length > numLines) {
      const del = this.messages.pop();
      del?.destroy(true);
    }
  }
}