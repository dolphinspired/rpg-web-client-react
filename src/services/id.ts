import { injectable } from '../di';

let id = 0;

@injectable()
export class IdServiceIncremental implements IdService {
  next(): string {
    return (++id).toString();
  }
  make(base: string) {
    return base + '-' + this.next();
  }
}

export interface IdService {
  next(): string;
  make(base: string): string;
}