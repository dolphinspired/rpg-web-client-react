import { Observable } from 'rxjs';

import { getAppServicesDecorators } from '../../../di';
import { IdService, ObservableStore } from '../../../services';

import { EventBuffer } from '.';

const { lazyInject } = getAppServicesDecorators();

export class InputBuffer<TEvent extends Event = Event> implements EventBuffer<TEvent> {
  @lazyInject('id') protected idService: IdService;
  @lazyInject('store') protected store: ObservableStore;

  protected events: TEvent[] = [];
  protected storeId: string;

  constructor() {
    this.storeId = this.idService.make('buffer-flush-events');
  }

  // EventBuffer implementation

  public push(event: TEvent): void {
    if (!this.shouldPush(event)) {
      return;
    }

    this.events.push(event);
    this.onPush(event);
  }

  public pop(): TEvent | undefined {
    if (!this.events.length) {
      return undefined;
    }

    const event = this.events.pop();
    this.onPop(event);
    return event;
  }

  public read(): TEvent[] {
    return this.events;
  }

  public flush(): TEvent[] {
    let events = [...this.events];
    this.events = [];
    this.onFlush(events);
    this.store.pushValue(this.storeId, events);
    return events;
  }

  public clear(): void {
    this.onClear(this.events);
    this.events = [];
  }

  // Optional lifecycle hooks

  protected shouldPush(event: TEvent): boolean { return true; }
  protected onPush(event: TEvent): void {}
  protected onPop(event: TEvent): void {}
  protected onFlush(events: TEvent[]): void {}
  protected onClear(events: TEvent[]): void {}

  // Observables

  public observeFlush(): Observable<TEvent[]> {
    return this.store.observe(this.storeId);
  }
}