/* @flow */

class SimplePullGauge {
  cb: ?() => number;

  constructor() {
    this.cb = null;
  }

  setCallback(cb: () => number): void {
    this.cb = cb;
  }

  resetCallback(): void {
    this.cb = null;
  }
}

export default SimplePullGauge;
