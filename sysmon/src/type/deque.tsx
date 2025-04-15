export class Deque<T> {
    private data: T[] = [];
    private _maxSize: number;
  
    constructor(maxSize: number) {
      this._maxSize = maxSize;
    }
  
    get maxSize() {
      return this._maxSize;
    }
  
    pushBack(item: T) {
      this.data.push(item);
      this.enforceLimit();
    }
  
    pushFront(item: T) {
      this.data.unshift(item);
      this.enforceLimit();
    }
  
    popBack(): T | undefined {
      return this.data.pop();
    }
  
    popFront(): T | undefined {
      return this.data.shift();
    }
  
    latest(): T | undefined {
      return this.data[this.data.length - 1];
    }
  
    getAll(): T[] {
      return [...this.data];
    }
  
    private enforceLimit() {
      while (this.data.length > this._maxSize) {
        this.popFront();
      }
    }
  }
  