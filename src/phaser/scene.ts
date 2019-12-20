import Phaser from "phaser";
import logoImg from "../assets/logo.png";
import { SocketService } from "../services/socket";
import { Chatbox } from './gui/chatbox';
import { ObservableStore, CommandService } from '../services';

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
  private commander: CommandService;

  constructor() {
    super("PlayGame");
    this.chatbox = new Chatbox(this);
    this.commander = new CommandService();
  }

  preload() {
    this.load.image("logo", logoImg);
  }

  create() {
    this.chatbox.create();
    this.socketeering(); // experimental socket stuff

    const logo = this.add.image(400, 150, "logo");

    this.add.text(600, 200, "Ping Server")
      .setInteractive()
      .on('pointerdown', () => this.commander.run('sock pringles'));
    this.add.text(600, 300, "Create Session")
      .setInteractive()
      .on('pointerdown', () => this.commander.run('open tarp board-test fed278'));
    this.add.text(600, 350, "Close Session")
      .setInteractive()
      .on('pointerdown', () => this.commander.run('close'));
    this.add.text(600, 450, "Join Session")
      .setInteractive()
      .on('pointerdown', () => this.commander.run('join tarp fed279'));
    this.add.text(600, 500, "Leave Session")
      .setInteractive()
      .on('pointerdown', () => this.commander.run('leave'))

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
    (window as any)['sock'] = sock;

    const store = new ObservableStore();
    (window as any)['store'] = store;

    store.observe('message').subscribe((m: ChatMessage) => {
      this.chatbox.push(`[${m.author}] ${m.message}`);
    });
    store.observe('errors').subscribe((m: ErrorMessage) => {
      this.chatbox.push(`[Error] ${m.message}`);
    });
    store.observe('session').subscribe((m: SessionMessage) => {
      this.chatbox.push(`[Session] ${m.message}`);
    });
    store.observe('pringles').subscribe((m: ChatMessage) => {
      this.chatbox.push(`[Ping] ${m.message}`);
    });
    store.observe('getdata').subscribe((b: any) => {
      console.log('[getdata]'+JSON.stringify(b));
    });

    sock.emit('pringles');
    store.pushValue('pringles',{message: 'via store'});
  }
}

export default playGame;
