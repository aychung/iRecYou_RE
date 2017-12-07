const AWS = require('../util/aws.js');
const axios = require('axios');

const searchQUrl = '';
const workers = [];
const numWorkers = 4;

const recommenderServer = '';
const recsListTopic = 'arn:aws:sns:us-west-1:587282304975:iRecYou_recsList';

class SearchWorker extends AWS.sqsWorker {
  constructor() {
    const searchHandler = (message, done) => {
      if (message) {
        // TODO: send request to load balancer
        axios(recommenderServer + '/rec_list/search/' + message.body)
          .then((resp) => {
            // TODO: check resp format
            return AWS.pubMessage(recsListTopic, resp);
          }).catch((err) => {
            console.log(err);
          });
      }
      done();
    };
    super(searchQUrl, searchHandler);
  }
}

const start = () => {
  for (let i = 0; i < numWorkers; i += 1) {
    const tempWorker = new SearchWorker();
    tempWorker.start();
    workers.push(tempWorker);
  }
};

module.exports.workers = workers;
module.exports.start = start;
