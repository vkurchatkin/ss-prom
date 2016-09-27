/* @flow */

class SimpleGauge {
  val: number;

  constructor() {
    this.val = 0;
  }

  set(value: number): void {
    this.val = value;
  }

  inc(value?: number): void {
    this.val += value || 1;
  }

  dec(value?: number): void {
    this.val -= value || 1;
  }
}

export default SimpleGauge;
