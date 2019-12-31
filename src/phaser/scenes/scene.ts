import Phaser from "phaser";
import logoImg from "../../assets/logo.png";
import { Chatbox } from '../gui/chatbox';
import * as s from '../../services';
import * as di from '../../di';

interface ConsoleMessage {
  message: string;
}

const { lazyInject } = di.getAppServicesDecorators();

export class playGame extends Phaser.Scene {
  private chatbox: Chatbox;
  @lazyInject('auth') private authService: s.AuthService;
  @lazyInject('cmd') private commander: s.CommandService;
  @lazyInject('store') private store: s.ObservableStore;

  constructor() {
    super("PlayGame");
    this.chatbox = new Chatbox(this);
  }

  preload() {
    this.load.image("logo", logoImg);
    setTimeout(() => {
      this.authService.auth();
    }, 1000);
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
    // (window as any)['chat'] = this.chatbox;

  }
  update() {
    this.chatbox.update();
  }
  socketeering() {
    this.store.observe('errors').subscribe((m: ConsoleMessage) => {
      this.chatbox.push(`[Error] ${m.message}`);
    });
    this.store.observe('console').subscribe((m: ConsoleMessage) => {
      this.chatbox.push(m.message);
    });
    this.store.observe('getdata').subscribe((b: any) => {
      console.log('[getdata]'+JSON.stringify(b));
    });
  }
}
