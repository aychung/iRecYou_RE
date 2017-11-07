// setup server to receive webAPIs
const server = require('./server');

const dbWorker = require('./dbWorker');
const recommender = require('./recommender');
const aws = require('./util/aws.js');
const cache = require('./cache');

const searchQUrl = 'https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou_RE_searchQuery';
const userActionQUrl = 'https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou_RE_userAction';
const recsListTopic = 'arn:aws:sns:us-west-1:587282304975:iRecYou_recsList';

const searchQHandler = async (message, done) => {
  //message.MessageId, message.Body
  console.log('searchQHandler> cache lookup for', message.Body);
  let rList = await cache.client.getAsync(message.Body);
  if (rList === null) {
    rList = await recommender.queryRListGraph(message.Body);
    console.log('searchQHandler> cache miss, new list:', rList);
    cache.client.setexAsync(message.Body, 3600, JSON.stringify(rList));
  }
  console.log('searchQHandler> publishing rlist', rList);
  await aws.pubMessage(recsListTopic, rList);

  // TODO: ELK logging before finishing

  done();
};

const uaerActionQHandler = (message, done) => {
  // TODO: add handler
  // TODO: ELK logging before finishing
  done();
};

// setup worker to pull search query from message bus
console.log('> strting searchQ worker');
const searchReq1 = new dbWorker.sqsWorker(searchQUrl, searchQHandler);
searchReq1.start();

// setup worker to pull user action from message bus
console.log('> strting actionQ worker');
const userAction = new dbWorker.sqsWorker(userActionQUrl, uaerActionQHandler);
userAction.start();


