/* @flow */

import type {
  LabelValue,
  AnyLabels
} from './types.js';

export function labelValueToString(val: LabelValue): string {
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }

  if (typeof val === 'number') {
    return numberToString(val);
  }

  return val;
}

// labelValues should be sorted at this point according to labelNames
export function createLabelsHash(labelNames: Array<string>, labelValues: Array<string>): string {
  return labelValues.join(',');
}

export function createLabelValues(
  labelNames: Array<string>,
  labelObj: AnyLabels
): Array<string> {
  const result = [];
  for (const labelName of labelNames) {
    const value = labelObj[labelName];

    if (typeof value === 'undefined') {
      throw new Error(`Label ${labelName} is not specified`);
    }

    result.push(labelValueToString(value));
  }

  return result;
}

export function numberToString(val: number): string {
  if (val === Infinity) {
    return '+Inf';
  }

  if (val === -Infinity) {
    return '-Inf';
  }

  if (isNaN(val)) {
    return 'NaN'; // TODO or is it Nan?
  }

  return val.toString();
}
