import keycoder from 'keycoder';
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
