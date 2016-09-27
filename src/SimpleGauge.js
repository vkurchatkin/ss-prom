/* @flow */

class SimpleGauge {
  val: number;

  constructor() {
    this.val = NaN;
  }

  set(value: number): void {
    this.val = value;
  }
}

export default SimpleGauge;
