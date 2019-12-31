import { Observable } from 'rxjs';

import { clamp } from '../../util';

import { InputBuffer } from '.';

export class InputBufferWithHistory<TEvent extends Event = Event> extends InputBuffer<TEvent> {
  private flushed: TEvent[][] = [];

  // Lifecycle hook implementations

  protected onFlush(events: TEvent[]): void {
    this.flushed.unshift(events);
  }

  // Class-specific methods

  // Loads the history at the specified index into the current event buffer
  public load(i: number): number {
    if (!this.flushed.length || i <= 0) {
      // Buffer has never been flushed, so there is no history to reference
      // OR goto(i < 0) is invalid, so do nothing
      // OR goto(0) means load the current events into the buffer, which they already are
      return 0;
    }

    // History index must be: 1 <= i <= # history events
    const index = clamp(i, 1, this.flushed.length) - 1;

    // Copy the historical events from this index into the current events buffer
    let events = [...this.flushed[index]];
    this.clear();
    events.forEach(event => {
      this.push(event);
    });

    return index;
  }
}