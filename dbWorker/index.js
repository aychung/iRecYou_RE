const AWS = require('../util/aws.js');
const graph = require('../database/graph.js');

const vidQUrl = '';
const workers = [];
const numWorkers = 1;

class DbWorker extends AWS.sqsWorker {
  constructor() {
    const dbHandler = (message, done) => {
      // TODO: check message format
      if (message) {
        const newVids = JSON.parse(message);
        graph.addManyVideos(newVids);
      }

      done();
    };
    super(vidQUrl, dbHandler);
  }
}

const start = () => {
  for (let i = 0; i < numWorkers; i += 1) {
    const tempWorker = new DbWorker();
    tempWorker.start();
    workers.push(tempWorker);
  }
};

module.exports.workers = workers;
module.exports.start = start;
