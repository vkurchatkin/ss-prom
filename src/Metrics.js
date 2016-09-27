 /* @flow */

import type {
  AsyncCollector,
  AsyncPullGauge,
  Collector,
  Counter,
  Gauge,
  Metric,
  MetricOpts,
  MetricOptsWithoutLabels,
  MetricType,
  PullGauge,
  SimpleAsyncPullGauge,
  SimpleCounter,
  SimpleGauge,
  SimplePullGauge
} from './types.js';

import CounterImpl from './Counter.js';

class Metrics {
  registeredNames: Set<string>;
  collectors: Array<Collector>;
  asyncCollectors: Array<AsyncCollector>;

  constructor() {
    this.registeredNames = new Set();
    this.collectors = [];
    this.asyncCollectors = []
  }

  // TODO handle errors while collecting
  async collect(): Promise<Array<Metric>> {
    let result = [];

    for (const collector of this.collectors) {
      result = result.concat(collector.collect());
    }

    const asyncMetrics = await Promise.all(
      this.asyncCollectors.map(
        collector => collector.collect()
      )
    );

    for (const batch of asyncMetrics) {
      result = result.concat(batch);
    }

    return result;
  }

  createMetric<T>(
    opts: MetricOpts,
    factory: (name: string, help: ?string, labels: Array<string>) => T
  ): T {
    const { name, help, labels = [] } = opts;

    if (this.registeredNames.has(name)) {
      throw new Error(`Can't register metric '${name}', already registered`);
    }

    this.registeredNames.add(name);

    const sortedLabels = labels.slice().sort();

    return factory(name, help, sortedLabels);
  }

  createCounter(opts: MetricOpts): Counter<*> {
    return this.createMetric(
      opts,
      (name, help, labels) => new CounterImpl(name, help, labels)
    );
  }

  createSimpleCounter(opts: MetricOptsWithoutLabels): SimpleCounter {
    const { name, help } = opts;
    return this.createCounter({ name, help }).withLabels({});
  }

  createGauge(opts: MetricOpts): Gauge<*> {
    throw new Error('TODO');
  }

  createSimpleGauge(opts: MetricOptsWithoutLabels): SimpleGauge {
    throw new Error('TODO');
  }

  createPullGauge(opts: MetricOpts): PullGauge<*> {
    throw new Error('TODO');
  }

  createSimplePullGauge(opts: MetricOptsWithoutLabels): SimplePullGauge {
    throw new Error('TODO');
  }

  createAsyncPullGauge(opts: MetricOpts): AsyncPullGauge<*>  {
    throw new Error('TODO');
  }

  createSimpleAsyncPullGauge(opts: MetricOptsWithoutLabels): SimpleAsyncPullGauge  {
    throw new Error('TODO');
  }
}

export default Metrics;
