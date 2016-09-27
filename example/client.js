'use strict';

const http = require('http');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class Client {
  constuctor(interval) {
    this.shouldShutdown = false;
    this.interval = interval;
  }

  makeRequest() {
    const url = process.env.TARGET_URL;
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        res.on('error', reject);
        res.on('end', resolve);
        res.resume();
      });

      req.on('error', reject);
    });
  }

  run() {
    const next = () => {
      if (this.shouldShutdown) {
        return;
      }

      this
        .makeRequest()
        .then(() => sleep(this.interval))
        .catch(e => console.error(e ? e.stack || '' : ''))
        .then(next);
    }

    next();
  }

  shutdown() {
    this.shouldShutdown = true;
  }
}

const clients = [];

function resize(size) {
  const delta = size - clients.length;

  if (delta > 0) {
    for (let i = 0; i < delta; i++) {
      const c = new Client(50 + Math.random() * 50);
      c.run();
      clients.push(c);
    }
  } else if (delta < 0) {
    for (let i = 0; i < -delta; i++) {
      const c = clients.pop();
      c.shutdown();
    }
  }
}

function run() {
  resize(Math.floor(10 + Math.random() * 10));
  console.log(`Running ${clients.length} clients`);
}

setInterval(run, 1e4);
run();
