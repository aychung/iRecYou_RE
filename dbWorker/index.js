const Consumer = require('sqs-consumer');
const AWS = require('../util/aws.js');


class sqsWorker {
  // messageHanlder = (message, done) => {}
  constructor (qUrl, messageHandler, sqs = AWS.sqs) {
    this.worker = Consumer.create({
      queueUrl: qUrl,
      handleMessage: messageHandler,
      waitTimeSeconds: 0,
      batchSize: 10,
      sqs: sqs,
    });
    this.worker.on('error', (err) => {
      console.log(err.message);
    });
  }

  start () {
    this.worker.start();
  }

  stop () {
    this.worker.stop();
  }
}

// const w1 = new sqsWorker('https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou_RE_userAction', 
//   (message, done) => {
//     console.log('w1:', message.MessageId, message.Body);
//     done();
//   });
// const w2 = new sqsWorker('https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou_RE_searchQuery', 
//   (message, done) => {
//     console.log('w2:', message.MessageId, message.Body);
//     done();
//   });
// w1.start();
// w2.start();

module.exports.sqsWorker = sqsWorker;

