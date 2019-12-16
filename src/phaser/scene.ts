import Phaser from "phaser";
import logoImg from "../assets/logo.png";
import { SocketService } from "../services/socket";

interface ChatMessage {
  author: string;
  message: string;
}

function socketeering() {
  const sock = new SocketService();
  sock.init();
  (window as any)['sock'] = sock.socket;

  sock.on<ChatMessage>('message').subscribe((m: ChatMessage) => {
    console.log('[message]'+JSON.stringify(m))
  });
  sock.on('getdata').subscribe((b: any) => {
    console.log('[getdata]'+JSON.stringify(b))
  })
}

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {
    this.load.image("logo", logoImg);
  }
  create() {
    socketeering(); // experimental socket stuff

    const logo = this.add.image(400, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1
    });
  }
}

export default playGame;
