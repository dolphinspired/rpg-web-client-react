import keycoder from 'keycoder';
import { Observable } from 'rxjs';

import { InputBufferWithHistory } from '.';

export class KeyboardBuffer extends InputBufferWithHistory<KeyboardEvent> {
  private str: string = "";
  private flushedStr: string[] = [];
  private storeIdString: string;

  constructor() {
    super();
    this.storeIdString = this.storeId + '-string';
  }

  // Lifecycle hook implementations

  onPush(event: KeyboardEvent): void {
    super.onPush(event);
    const char = keycoder.eventToCharacter(event);
    if (char) this.str += char;
  }

  onPop(event: KeyboardEvent): void {
    super.onPop(event);
    const char = keycoder.eventToCharacter(event);
    if (char) {
      // If the popped event was a writeable char, then remove that char from the string as well
      this.str = this.str.substr(0, this.str.length - 1);
    }
  }

  onFlush(events: KeyboardEvent[]): KeyboardEvent[] {
    super.onFlush(events);
    const str = this.str;
    this.str = "";
    this.flushedStr.unshift(str);
    this.store.pushValue(this.storeIdString, str);
    return events;
  }

  onClear(events: KeyboardEvent[]) {
    super.onClear(events);
    this.str = "";
  }

  // Class-specific methods

  popChar(): string {
    let char = "";
    if (this.str.length === 0) {
      return char;
    }

    do {
      // Continue popping events...
      const event = this.pop();
      if (!event) {
        // If no events can be popped for some reason, quit immediately
        return char;
      }
      char = keycoder.eventToCharacter(event);
    } while (!char) // ...until a char can be parsed from one

    // If a char can be parsed, then popEvent has removed this char from the string
    return char;
  }

  readString(): string {
    return this.str;
  }

  // Observables

  observeFlushString(): Observable<string> {
    return this.store.observe(this.storeIdString);
  }
}