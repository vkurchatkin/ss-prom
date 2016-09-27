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

import CollectorRegistry from './CollectorRegistry.js';
import CounterImpl from './Counter.js';
import GaugeImpl from './Gauge.js';

class Metrics {
  registeredNames: Set<string>;
  registry: CollectorRegistry;

  constructor() {
    this.registeredNames = new Set();
    this.registry = new CollectorRegistry();
  }

  createMetric<T>(
    opts: MetricOpts,
    factory: (name: string, help: string, labels: Array<string>) => T,
    register: (metric: T) => void
  ): T {
    const { name, help, labels = [] } = opts;

    if (this.registeredNames.has(name)) {
      throw new Error(`Can't register metric '${name}', already registered`);
    }

    this.registeredNames.add(name);

    const sortedLabels = labels.slice().sort();

    const metric = factory(name, help, sortedLabels);

    register(metric);

    return metric;
  }

  createCounter(opts: MetricOpts): Counter<*> {
    return this.createMetric(
      opts,
      (name, help, labels) => new CounterImpl(name, help, labels),
      (metric) => this.registry.register(metric)
    );
  }

  createSimpleCounter(opts: MetricOptsWithoutLabels): SimpleCounter {
    const { name, help } = opts;
    return this.createCounter({ name, help }).withLabels({});
  }

  createGauge(opts: MetricOpts): Gauge<*> {
    return this.createMetric(
      opts,
      (name, help, labels) => new GaugeImpl(name, help, labels),
      (metric) => this.registry.register(metric)
    );
  }

  createSimpleGauge(opts: MetricOptsWithoutLabels): SimpleGauge {
    const { name, help } = opts;
    return this.createGauge({ name, help }).withLabels({});
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
