/* @flow */

import type {
  AsyncCollector,
  AsyncPullGauge,
  Collector,
  CollectorRegistry,
  Counter,
  Format,
  Gauge,
  Histogram,
  MetricsFactory,
  PullGauge,
  SimpleAsyncPullGauge,
  SimpleCounter,
  SimpleGauge,
  SimpleHistogram,
  SimplePullGauge
} from './types.js';

import CollectorRegistryImpl from './CollectorRegistry.js';
import MetricsFactoryImpl from './MetricsFactory.js';
import StandardCollector from './StandardCollector.js';
import TextFormat from './TextFormat.js';

export function createMetrics(): MetricsFactory {
  const registry = new CollectorRegistryImpl();
  const standardCollector = new StandardCollector();
  registry.register(standardCollector);
  const factory = new MetricsFactoryImpl(registry);
  return factory;
}

export function createTextFormat(): Format {
  return new TextFormat();
}

export type {
  AsyncCollector,
  AsyncPullGauge,
  Collector,
  CollectorRegistry,
  Counter,
  Format,
  Gauge,
  Histogram,
  MetricsFactory,
  PullGauge,
  SimpleAsyncPullGauge,
  SimpleCounter,
  SimpleGauge,
  SimpleHistogram,
  SimplePullGauge
};
