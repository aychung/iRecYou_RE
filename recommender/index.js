const graph = require('../database/graph.js');
const cache = require('../cache');
const statsd = require('../util/statsd.js');
const logger = require('../logger').logger;

const statsDclient = statsd.client;

// TODO: change to serve list from trending vid's on cache miss
const vidRListGraph = async (vidId) => {
  try {
    let rList = await cache.client.getAsync(vidId);
    if (rList === null) {
      rList = [];
      for (let i = 0; i < 8; i++) {
        let temp;
        do {
          temp = Math.floor(Math.random() * 500000);
        } while (rList.indexOf(temp) !== -1);
        rList.push(temp);
      }
      statsDclient.increment('vidRList.cacheMiss');
      logger.info('vidRList.cacheMiss', vidId);

      graph.getRListFromVidId(vidId)
        .then(newList => {
          while(newList.length < 8) {
            let temp = Math.floor(Math.random() * 500000);
            if (newList.indexOf(temp) === -1) {
              newList.push(temp);
            }
          }
          cache.client.setexAsync(vidId, 3600, JSON.stringify(newList));
        });
    } else {
      statsDclient.increment('vidRList.cacheHit');
      logger.info('vidRList.cacheHit', vidId);

      rList = JSON.parse(rList);
    }
    statsDclient.increment('vidRList.totalCreated');
    return rList;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    return null;
  }
};

// TODO: change to serve list from trending vid's on cache miss
const queryRListGraph = async (query) => {
  try{
    let rList = await cache.client.getAsync(query);
    if (rList === null) {
      rList = [];
      while (rList.length < 4) {
        let temp;
        do {
          temp = Math.floor(Math.random() * 500000);
        } while (rList.indexOf(temp) !== -1);
        rList.push(temp);
      }

      statsDclient.increment('queryRList.cacheMiss');
      logger.info('queryRList.cacheMiss', query);

      graph.getRListFromQeury(query)
        .then(newList => {
          while(newList.length < 4) {
            let temp = Math.floor(Math.random() * 500000);
            if (newList.indexOf(temp) === -1) {
              newList.push(temp);
            }
          }
          cache.client.setexAsync(query, 3600, JSON.stringify(rList));
        });
    } else {
      statsDclient.increment('queryRList.cacheHit');
      logger.info('queryRList.cacheHit', query);

      rList = JSON.parse(rList);
    }
    return rList;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    return null;
  }
};

const vidRList = () => {
  return db.Videos.count()
    .then((c) => {
      const result = [];
      while (result.length !== 8) {
        let temp;
        do {
          temp = Math.floor(Math.random() * c);
        } while (result.indexOf(temp) !== -1);
        result.push(temp);
      }
      return result;
    });
};

const queryRList = () => {
  return db.Videos.count()
    .then((c) => {
      const result = [];
      while (result.length !== 4) {
        let temp;
        do {
          temp = Math.floor(Math.random() * c);
        } while (result.indexOf(temp) !== -1);
        result.push(temp);
      }
      return result;
    });
};

module.exports.vidRList = vidRList;
module.exports.queryRList = queryRList;
module.exports.vidRListGraph = vidRListGraph;
module.exports.queryRListGraph = queryRListGraph;
