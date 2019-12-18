import Phaser from "phaser";
import logoImg from "../assets/logo.png";
import { SocketService } from "../services/socket";
import { Chatbox } from './gui/chatbox';

interface ChatMessage {
  author: string;
  message: string;
}

interface ErrorMessage {
  message: string;
}

interface SessionMessage {
  message: string;
}

class playGame extends Phaser.Scene {
  private chatbox: Chatbox;

  constructor() {
    super("PlayGame");
    this.chatbox = new Chatbox(this);
  }

  preload() {
    this.load.image("logo", logoImg);
  }

  create() {
    this.chatbox.create();
    this.socketeering(); // experimental socket stuff

    const logo = this.add.image(400, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1
    });
    (window as any)['chat'] = this.chatbox;
  }
  update() {
    this.chatbox.update();
  }
  socketeering() {
    const sock = new SocketService();
    sock.init();
    (window as any)['sock'] = sock.socket;

    sock.on('message').subscribe((m: ChatMessage) => {
      this.chatbox.push(`[${m.author}] ${m.message}`);
    });
    sock.on('errors').subscribe((m: ErrorMessage) => {
      this.chatbox.push(`[Error] ${m.message}`);
    });
    sock.on('session').subscribe((m: SessionMessage) => {
      this.chatbox.push(`[Session] ${m.message}`);
    });
    sock.on('pringles').subscribe((m: ChatMessage) => {
      this.chatbox.push(`[Ping] ${m.message}`);
    });
    sock.on('getdata').subscribe((b: any) => {
      console.log('[getdata]'+JSON.stringify(b));
    });
  }
}

export default playGame;
