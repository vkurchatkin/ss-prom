'use strict';

const http = require('http');
const prom = require('ss-prom');

const metrics = prom.createMetrics();
const counter = metrics.createCounter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests made.',
  labels: ['code', 'method', 'handler']
});

const format = prom.createTextFormat();

function targetHandler() {
  return new Promise(resolve => {
    const p = Math.random();
    const code = p < 0.25 ? 500 : 200;
    const str = code === 200 ? 'OK' : 'Error';

    setTimeout(() => resolve({
      code,
      body: str,
      name: 'target'
    }), Math.random() *  300)
  })
}

function metricsHandler() {
  return metrics.collector
    .collect()
    .then(metrics => {
      const body = format.encode(metrics);
      return {
        code: 200,
        name: 'metrics',
        headers: {
          'content-type': format.mimeType
        },
        body
      };
    });
}

function indexHandler() {
  return Promise.resolve({
    name: 'index',
    code: 200,
    body: 'Hello world'
  });
}

function notFoundHandler() {
  return Promise.resolve({
    name: 'not_found',
    code: 404,
    body: 'Not found'
  });
}

const handlers = {
  '/': indexHandler,
  '/metrics': metricsHandler,
  '/target': targetHandler
};

http.createServer((req, res) => {
  let handler = handlers[req.url] || notFoundHandler;
  handler()
    .then(r => {
      res.writeHead(r.code, r.headers);
      res.end(r.body);
      counter.inc({ code: r.code, handler: r.name, method: req.method });
    })
    .catch(err => {
      res.writeHead(500);
      res.end(err ? err.stack || '' : '')
    });
}).listen(7777, (err) => {
  if (err) {
    throw err;
  }
});

process.on('SIGTERM', () => process.exit(0));
