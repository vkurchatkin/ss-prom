/* @flow */

class SimpleCounter {
  val: number;

  constructor() {
    this.val = 0;
  }

  // TODO check number sign?
  inc(val?: number): void {
    this.val += val || 1;
  }
}

export default SimpleCounter;
