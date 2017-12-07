const express = require('express');
const RE = require('../recommender');
const statsd = require('../util/statsd.js');
const searchWorker = require('../searchWorker');
const dbWorker = require('../dbWorker');
const logger = require('../logger').logger;
const morgan = require('morgan');

const app = express();

app.use(morgan({"stream": logger.stream}));

const statsDclient = statsd.client;

statsDclient.socket.on('error', (error) => {
  console.error('Error in socket: ', error);
  return null;
});

app.get('/', (req, res) => {
  statsDclient.increment('emptyGet');
  const result = 'Hello World!\n';
  res.send(result);
});

app.get('/rec_list/vid/:id', (req, res) => {
  const start = Date.now();

  RE.vidRListGraph(req.params.id)
    .then((resp) => {
      const temp = {};
      temp[req.params.id] = resp;
      res.send(temp);
      const latency = Date.now() - start;
      statsDclient.timing('vidRList.Latency', latency);
      statsDclient.increment('vidRList.counter');
    }).catch((e) => {
      console.log(`> SERVER ERROR: ${e}`);
      res.end();
    });
});

app.get('/rec_list/search/:query', (req, res) => {
  const start = Date.now();
  logger.info('recsList request', req.params.query);

  RE.queryRListGraph(req.params.query)
    .then((resp) => {
      const temp = {};
      temp[req.params.query] = resp;
      res.send(temp);
      const latency = Date.now() - start;
      statsDclient.timing('queryRList.Latency', latency);
      statsDclient.increment('queryRList.counter');
      logger.info('genRecsList', req.params.query, temp);
    }).catch((e) => {
      console.log(`> SERVER ERROR: ${e}`);
      res.end();
    });
});

app.get('/search_worker/start', (req, res) => {
  console.log('> starting 4 search workers!');
  searchWorker.start();
  res.end();
  logger.info('starting search worker');
});

app.get('/db_worker/start', (req, res) => {
  console.log('> starting 1 search worker!');
  dbWorker.start();
  res.end();
  logger.info('starting DB worker');
});

const server = app.listen(3000, () => {
  console.log('> Server listening on port 3000!');
});

module.exports = server;
