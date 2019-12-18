export class Chatbox {
  public bufferSize = 10;
  public lineSpacing = 2;
  public fontSize = 12;

  private scene: Phaser.Scene;
  private messages: Phaser.GameObjects.Text[] = [];
  private newMessages: { timestamp: number, message: string }[] = [];

  private currentTime: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.currentTime = Date.now();
  }
  preUpdate(time: number, delta: number): void {
    this.currentTime = time;
  }
  update() {
    const updated = this.newMessages.length > 0;

    if (updated) {
      const font = { fontFamily: "Courier New, sans-serif", fontSize: this.fontSize, color: "#FFFFFF" };
      const ts = new Date(this.currentTime).toLocaleTimeString();
      this.newMessages.forEach(m => {
        this.messages.unshift(this.scene.add.text(0, 0, `[${ts}] ${m.message}`, font));
      });
      this.newMessages = [];

      // Trim message list to be no longer than buffer size
      while (this.messages.length > this.bufferSize) {
        const del = this.messages.pop();
        del?.destroy(true);
      }

      // Adjust message display coords such that the newest messages appear on the bottom
      let x = 10;
      let y = this.scene.game.scale.height - this.lineSpacing;
      this.messages.forEach(text => {
        text.x = x;
        y -= (this.fontSize + this.lineSpacing);
        text.y = y;
        text.update();
      });
    }
  }
  push(message: string) {
    this.newMessages.push({ timestamp: this.currentTime, message });
  }
  clear() {
    this.newMessages = [];
  }
}