/* @flow */

import type {
  AnyLabels
} from './types.js';

import PushParentMetric from './PushParentMetric.js';
import SimpleCounterImpl from './SimpleCounter.js';

class Counter extends PushParentMetric<SimpleCounterImpl> {
  constructor(
    name: string,
    help: string,
    labels: Array<string>
  ) {
    super(
      name,
      help,
      'Counter',
      labels,
      () => new SimpleCounterImpl()
    );
  }

  inc(labels: AnyLabels, val?: number) {
    this.withLabels(labels).inc(val);
  }
}

export default Counter;
