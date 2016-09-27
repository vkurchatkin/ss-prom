/* @flow */

import type {
  Metrics
} from './types.js';

import MetricsImpl from './Metrics.js';

export function createMetrics(): Metrics {
  return new MetricsImpl();
}

export type {
  Metrics
}
