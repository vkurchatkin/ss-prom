# ss-prom
## Simple Prometheus client

## Examples

Create metrics:

```js
const metrics = createMetrics();
```

Create counter:

```js
const counter: Counter<{ url: string, code: number }> = metrics.createCounter({
  name: 'http_requests_total',
  labels: ['url', 'code']
});

counter.inc({ url: '/foo', code: 200 });

// or
const child = counter.withLabels({ url: '/foo', code: 200 });
child.inc();
```

Create counter without labels:

```js
const counter = metrics.createSimpleCounter({
  name: 'foo'
});

counter.inc();
```

## Roadmap

  - summaries;
  - push gateway;
