/* @flow */

import type {
  AnyLabels
} from './types.js';

import PushParentMetric from './PushParentMetric.js';
import SimpleGaugeImpl from './SimpleGauge.js';

class Gauge extends PushParentMetric<SimpleGaugeImpl> {
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
      () => new SimpleGaugeImpl()
    );
  }

  inc(labels: AnyLabels, val?: number) {
    this.withLabels(labels).inc(val);
  }

  dec(labels: AnyLabels, val?: number) {
    this.withLabels(labels).dec(val);
  }

  set(labels: AnyLabels, val: number) {
    this.withLabels(labels).set(val);
  }
}

export default Gauge;
