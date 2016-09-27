/* @flow */

export type LabelValue = string | number | boolean;

export type AnyLabels = { [key: string]: LabelValue };

export type MetricType =
  | 'Counter'
  | 'Gauge'
  | 'Summary'
  | 'Histogram'
;

export type Sample = {
  name: string,
  value: number,
  labelNames: Array<string>,
  labelValues: Array<string>
}

export type Metric = {
  name: string,
  help: string,
  type: MetricType,
  samples: Array<Sample>
}

export type Child<T> = {
  labelValues: Array<string>,
  obj: T
};

export interface Collector {
  collect(): Array<Metric>
}

export interface AsyncCollector {
  collect(): Promise<Array<Metric>>
}

export interface CollectorRegistry {
  register(collector: Collector): void;
  unregister(collector: Collector): void;
  registerAsync(collector: AsyncCollector): void;
  unregisterAsync(collector: AsyncCollector): void;
}

// Metric that has labeled children
export interface ParentMetric<T, U> {
  withLabels(labels: T): U
}

// Counter with no labels
export interface SimpleCounter {
  inc(val?: number): void
}

// Counter with labels
export interface Counter<T: AnyLabels> extends ParentMetric<T, SimpleCounter> {
  inc(labels: T, val?: number): void
}

// Push gauge with no labels
export interface SimpleGauge {
  set(value: number): void,
  inc(val?: number): void,
  dec(val?: number): void
}

// Pull gauge with no labels
export interface SimplePullGauge {
  setCallback(cb: () => number): void,
  resetCallback(): void // set callback to null
}

// Async pull gauge with no labels
export interface SimpleAsyncPullGauge {
  setCallback(cb: () => Promise<number>): void,
  resetCallback(): void // set callback to null
}

// Push gauge with children
export interface Gauge<T> extends ParentMetric<T, SimpleGauge> {
  set(labels: T, value: number): void,
  inc(labels: T, val?: number): void,
  dec(labels: T, val?: number): void
}

// Pull gauge with children
export interface PullGauge<T> extends ParentMetric<T, SimplePullGauge> {
  setCallback(labels: T, cb: () => number): void,
  resetAllCallbacks(): void
}

// Async pull gauge with children
export interface AsyncPullGauge<T> extends ParentMetric<T, SimpleAsyncPullGauge> {
  setCallback(labels: T, cb: () => Promise<number>): void,
  resetAllCallbacks(): void
}

export type MetricOptsWithoutLabels = {
  name: string,
  help: string
};

export type MetricOpts = {
  name: string,
  help: string,
  labels?: Array<string>
};

export interface Format {
  mimeType: string,
  encode(metrics: Array<Metric>): string
}

// A factory to create and register metrics
export interface MetricsFactory {
  createCounter(opts: MetricOpts): Counter<*>,
  createSimpleCounter(opts: MetricOptsWithoutLabels): SimpleCounter,

  createGauge(opts: MetricOpts): Gauge<*>,
  createSimpleGauge(opts: MetricOptsWithoutLabels): SimpleGauge,

  createPullGauge(opts: MetricOpts): PullGauge<*>,
  createSimplePullGauge(opts: MetricOptsWithoutLabels): SimplePullGauge,

  createAsyncPullGauge(opts: MetricOpts): AsyncPullGauge<*>,
  createSimpleAsyncPullGauge(opts: MetricOptsWithoutLabels): SimpleAsyncPullGauge,
}
