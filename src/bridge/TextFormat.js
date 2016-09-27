// /* @flow */
//
// import type {
//   HttpResponse
// } from 'ss-commons/http';
//
// import type {
//   Metric
// } from '../types.js';
//
// import type MetricsCollector from '../MetricsCollector.js';
//
// const CONTENT_TYPE = 'text/plain; version=0.0.4';
//
// export function labelsToString(labels: Array<[string, string]>): string {
//   if (labels.length === 0) {
//     return '';
//   }
//
//   let result = '{';
//
//   result += labels
//     .map(([key, val]) => `${key}=${val}`)
//     .join(',');
//
//   result += '}';
//
//   return result;
// }
//
// class TextFormatBridge {
//   metricsCollector: MetricsCollector;
//
//   constructor(metricsCollector: MetricsCollector) {
//     this.metricsCollector = metricsCollector;
//   }
//
//   async call(): Promise<HttpResponse<Buffer>> {
//     let str = '';
//
//     const metrics: Array<Metric> = this.metricsCollector.metrics;
//
//     for (const metric of metrics) {
//       const { help, name, type } = metric;
//
//       if (help) {
//         str += `# HELP ${name} ${help}\n`;
//       }
//
//       str += `# TYPE ${name} ${type}\n`;
//
//       const samples = metric.getSamples();
//
//       for (const sample of samples) {
//         const { name, value, labels } = sample;
//         str += `${name}${labelsToString(labels)} ${value}\n`;
//       }
//     }
//
//     // TODO gzip
//     return {
//       statusCode: 200,
//       headers: {
//         'content-type': CONTENT_TYPE
//       },
//       body: new Buffer(str)
//     };
//   }
// }
//
// export default TextFormatBridge;
