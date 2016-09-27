/* @flow */

import type {
  AnyLabels,
  Metric
} from './types.js';

import ParentMetric from './ParentMetric.js';
import SimpleAsyncPullGaugeImpl from './SimpleAsyncPullGauge.js';

class AsyncPullGauge extends ParentMetric<SimpleAsyncPullGaugeImpl> {
  constructor(
    name: string,
    help: string,
    labels: Array<string>
  ) {
    super(
      name,
      help,
      'Gauge',
      labels,
      () => new SimpleAsyncPullGaugeImpl()
    );
  }

  async collect(): Promise<Array<Metric>> {
    const { name, help, labelNames, type } = this;
    const samples = [];

    const children = this.children
      .map(child => child.obj.cb && [child, child.obj.cb()]);

    for (const t of children) {
      if (!t) {
        continue;
      }
      const [child, promise] = t;
      const { labelValues, obj } = child;

      samples.push({
        name,
        value: await promise,
        labelNames,
        labelValues
      });
    }

    return [
      {
        name,
        help,
        type,
        samples
      }
    ];
  }

  setCallback(labels: AnyLabels, cb: () => Promise<number>): void {
    this.withLabels(labels).setCallback(cb);
  }

  resetAllCallbacks(): void {
    this.children.forEach(child => {
      child.obj.resetCallback();
    });
  }
}

export default AsyncPullGauge;
