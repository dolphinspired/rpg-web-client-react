let id = 0;

export class IdService {
  static next(): number {
    return ++id;
  }
  next(): number {
    return ++id;
  }
}