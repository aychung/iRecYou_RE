const StatsD = require('node-statsd');

const client = new StatsD({
  host: 'statsd.hostedgraphite.com',
  port: 8125,
  prefix: '12630516-1d94-4dd0-b8dd-9a9a3e8e3aa2',
});

module.exports.client = client;
