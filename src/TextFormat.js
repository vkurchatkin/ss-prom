/* @flow */

import type {
  Metric
} from './types.js';

function labelsToString(labelNames: Array<string>, labelValues: Array<string>): string {
  if (labelNames.length === 0) {
    return '';
  }

  let result = '{';

  for (let i = 0; i < labelNames.length; i++) {
    const name = labelNames[i];
    const value = labelValues[i];

    result += `${name}=${value}`;

    if (i !== labelNames.length - 1) {
      result += ','
    }
  }

  result += '}';

  return result;
}

class TextFormat {
  mimeType: string;

  constructor() {
    this.mimeType = 'text/plain; version=0.0.4';
  }

  encode(metrics: Array<Metric>): string {
    let str = '';
    for (const metric of metrics) {
      const { help, name, type } = metric;

      if (help) {
        str += `# HELP ${name} ${help}\n`;
      }

      str += `# TYPE ${name} ${type.toLowerCase()}\n`;

      const samples = metric.samples;

      for (const sample of samples) {
        const { name, value, labelNames, labelValues } = sample;
        str += `${name}${labelsToString(labelNames, labelValues)} ${value}\n`;
      }
    }

    return str;
  }
}

export default TextFormat;
