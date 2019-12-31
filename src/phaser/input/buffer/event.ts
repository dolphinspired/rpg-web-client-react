export interface EventBuffer<TEvent extends Event = Event> {
  push(event: TEvent): void;
  pop(): TEvent | undefined;
  read(): TEvent[];
  flush(): TEvent[];
  clear(): void;
}
