/* @flow */

import type {
  Collector,
  AsyncCollector,
  Metric
} from './types.js';

class CollectoryRegistry {
  collectors: Array<Collector>;
  asyncCollectors: Array<AsyncCollector>;

  constructor() {
    this.collectors = [];
    this.asyncCollectors = [];
  }

  register(collector: Collector) {
    this.collectors.push(collector);
  }

  registerAsync(collector: AsyncCollector) {
    this.asyncCollectors.push(collector);
  }

  unregister(collector: Collector) {
    const idx = this.collectors.indexOf(collector);

    if (idx !== -1) {
      this.collectors.splice(idx, 1);
    }
  }

  unregisterAsync(collector: AsyncCollector) {
    const idx = this.asyncCollectors.indexOf(collector);

    if (idx !== -1) {
      this.asyncCollectors.splice(idx, 1);
    }
  }

  async collect(): Promise<Array<Metric>> {
    let result = [];

    for (const collector of this.collectors) {
      result = result.concat(collector.collect());
    }

    const promises =
      this.asyncCollectors.map(
        collector => collector.collect()
      )
    ;

    for (const promise of promises) {
      const metrics = await promise;
      result = result.concat(metrics);
    }

    return result;
  }

}

export default CollectoryRegistry;
