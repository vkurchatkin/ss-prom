/* @flow */

import type {
  AnyLabels,
  Child,
  MetricType
} from './types.js';

import {
  createLabelsHash,
  createLabelValues
} from './util.js';

class ParentMetric<T> {
  name: string;
  help: string;
  type: MetricType;
  labelNames: Array<string>;
  children: Array<Child<T>>;
  childrenByHash: { [hash: string]: ?Child<T> };
  factory: () => T;

  constructor(
    name: string,
    help: string,
    type: MetricType,
    labels: Array<string>,
    factory: () => T
  ) {
    this.name = name;
    this.help = help;
    this.type = type;
    this.labelNames = labels;
    this.children = [];
    this.childrenByHash = {};
    this.factory = factory;
  }

  withLabels(labels: AnyLabels): T {
    const labelValues = createLabelValues(this.labelNames, labels);
    const hash = createLabelsHash(this.labelNames, labelValues);

    let child = this.childrenByHash[hash];

    if (child) {
      return child.obj;
    }

    const obj = this.factory();

    child = {
      labelValues,
      obj
    };

    this.childrenByHash[hash] = child;
    this.children.push(child);
    return obj;
  }

  remove(labels: AnyLabels): void {
    const labelValues = createLabelValues(this.labelNames, labels);
    const hash = createLabelsHash(this.labelNames, labelValues);

    const child = this.childrenByHash[hash];

    if (!child) {
      return;
    }

    delete this.childrenByHash[hash];

    const idx = this.children.indexOf(child);

    if (idx !== -1) {
      this.children.splice(idx, 1);
    }
  }

  clear(): void {
    this.children = [];
    this.childrenByHash = {};
  }
}

export default ParentMetric;
