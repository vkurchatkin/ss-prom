/* @flow */

import type {
  AnyLabels,
  Metric
} from './types.js';

import ParentMetric from './ParentMetric.js';
import SimplePullGaugeImpl from './SimplePullGauge.js';

class PullGauge extends ParentMetric<SimplePullGaugeImpl> {
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
      () => new SimplePullGaugeImpl()
    );
  }

  collect(): Array<Metric> {
    const { name, help, labelNames, type } = this;
    const samples = [];


    for (const child of this.children) {
      const { labelValues, obj } = child;

      if (obj.cb) {
        samples.push({
          name,
          value: obj.cb(),
          labelNames,
          labelValues
        });
      }
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

  setCallback(labels: AnyLabels, cb: () => number): void {
    this.withLabels(labels).setCallback(cb);
  }

  resetAllCallbacks(): void {
    this.children.forEach(child => {
      child.obj.resetCallback();
    });
  }
}

export default PullGauge;
