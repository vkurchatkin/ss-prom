/* @flow */

class SimpleAsyncPullGauge {
  cb: ?() => Promise<number>;

  constructor() {
    this.cb = null;
  }

  setCallback(cb: () => Promise<number>): void {
    this.cb = cb;
  }

  resetCallback(): void {
    this.cb = null;
  }
}

export default SimpleAsyncPullGauge;
