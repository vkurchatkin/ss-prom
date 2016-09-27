 /* @flow */

import type {
  AsyncCollector,
  AsyncPullGauge,
  CollectorRegistry,
  Counter,
  Gauge,
  MetricOpts,
  MetricOptsWithoutLabels,
  PullGauge,
  SimpleAsyncPullGauge,
  SimpleCounter,
  SimpleGauge,
  SimplePullGauge
} from './types.js';

import AsyncPullGaugeImpl from './AsyncPullGauge.js';
import CounterImpl from './Counter.js';
import GaugeImpl from './Gauge.js';
import PullGaugeImpl from './PullGauge.js';
import TextFormat from './TextFormat.js';

class MetricsFactory {
  registeredNames: Set<string>;
  registry: CollectorRegistry;
  collector: AsyncCollector;

  constructor(registry: CollectorRegistry) {
    this.registeredNames = new Set();
    this.registry = registry;
    this.collector = registry;
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
    return this.createMetric(
      opts,
      (name, help, labels) => new PullGaugeImpl(name, help, labels),
      (metric) => this.registry.register(metric)
    );
  }

  createSimplePullGauge(opts: MetricOptsWithoutLabels): SimplePullGauge {
    const { name, help } = opts;
    return this.createPullGauge({ name, help }).withLabels({});
  }

  createAsyncPullGauge(opts: MetricOpts): AsyncPullGauge<*> {
    return this.createMetric(
      opts,
      (name, help, labels) => new AsyncPullGaugeImpl(name, help, labels),
      (metric) => this.registry.registerAsync(metric)
    );
  }

  createSimpleAsyncPullGauge(opts: MetricOptsWithoutLabels): SimpleAsyncPullGauge {
    const { name, help } = opts;
    return this.createAsyncPullGauge({ name, help }).withLabels({});
  }
}

export default MetricsFactory;
