/* @flow */

import type {
  AsyncCollector,
  AsyncPullGauge,
  Collector,
  CollectorRegistry,
  Counter,
  Format,
  Gauge,
  MetricsFactory,
  PullGauge,
  SimpleAsyncPullGauge,
  SimpleCounter,
  SimpleGauge,
  SimplePullGauge
} from './types.js';

import CollectorRegistryImpl from './CollectorRegistry.js';
import MetricsFactoryImpl from './MetricsFactory.js';
import StandardCollector from './StandardCollector.js';

export function createMetrics(): MetricsFactory {
  const registry = new CollectorRegistryImpl();
  const standardCollector = new StandardCollector();
  registry.register(standardCollector);
  const factory = new MetricsFactoryImpl(registry);
  return factory;
}

export type {
  AsyncCollector,
  AsyncPullGauge,
  Collector,
  CollectorRegistry,
  Counter,
  Format,
  Gauge,
  MetricsFactory,
  PullGauge,
  SimpleAsyncPullGauge,
  SimpleCounter,
  SimpleGauge,
  SimplePullGauge
}
