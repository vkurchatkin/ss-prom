'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMetrics = createMetrics;
exports.createTextFormat = createTextFormat;

var _CollectorRegistry = require('./CollectorRegistry.js');

var _CollectorRegistry2 = _interopRequireDefault(_CollectorRegistry);

var _MetricsFactory = require('./MetricsFactory.js');

var _MetricsFactory2 = _interopRequireDefault(_MetricsFactory);

var _StandardCollector = require('./StandardCollector.js');

var _StandardCollector2 = _interopRequireDefault(_StandardCollector);

var _TextFormat = require('./TextFormat.js');

var _TextFormat2 = _interopRequireDefault(_TextFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMetrics() {
  const registry = new _CollectorRegistry2.default();
  const standardCollector = new _StandardCollector2.default();
  registry.register(standardCollector);
  const factory = new _MetricsFactory2.default(registry);
  return factory;
}

function createTextFormat() {
  return new _TextFormat2.default();
}