/* @flow */

import type {
  Metric
} from './types.js';

function simpleMetric(name, help, type, value) {
  return {
    name,
    help,
    type,
    samples: [
      {
        name,
        labelNames: [],
        labelValues: [],
        value
      }
    ]
  };
}

class StandardCollector {
  startTime: number;

  constructor() {
    this.startTime = (Date.now() / 1000) - process.uptime();
  }

  collect(): Array<Metric> {
    const cpuUsage = process.cpuUsage();
    const memoryUsage = process.memoryUsage();

    return [
      simpleMetric(
        'process_cpu_seconds_total',
        'Total user and system CPU time spent in seconds.',
        'Counter',
        (cpuUsage.system + cpuUsage.user) / 1e6
      ),
      simpleMetric(
        'process_start_time_seconds',
        'Start time of the process since unix epoch in seconds',
        'Gauge',
        this.startTime
      ),
      simpleMetric(
        'nodejs_heap_size_total_bytes',
        'Total V8 heap size in bytes',
        'Gauge',
        memoryUsage.heapTotal
      ),
      simpleMetric(
        'nodejs_heap_size_used_bytes',
        'Used V8 heap size in bytes',
        'Gauge',
        memoryUsage.heapUsed
      ),
      simpleMetric(
        'process_resident_memory_bytes',
        'Resident memory size in bytes.',
        'Gauge',
        memoryUsage.rss
      )
    ];
  }
}

export default StandardCollector;
