/*
=========================
Things to do in aws console
1. Setup Topic in SNS.
2. Setup SQS to subscribe SNS topic.
=========================

Queue:
search Query: https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou_RE_searchQuery
user Action: https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou_RE_userAction

Pub:
recList: arn:aws:sns:us-west-1:587282304975:iRecYou_recsList
*/

const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');

AWS.config.update({ region: 'us-west-1' });

// Create SQS and SNS service object
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

const listQ = () => {
  return new Promise((resolve, reject) => {
    sqs.listQueues({}, (err, data) => {
      if (err) {
        console.log('Error', err);
        reject(err);
      } else {
        console.log('Success', data.QueueUrls);
        resolve(data);
      }
    });
  });
};

const getQUrl = (qName) => {
  return new Promise((resolve, reject) => {
    sqs.getQueueUrl({ QueueName: qName }, (err, data) => {
      if (err) {
        console.log('Error', err);
        reject(err);
      } else {
        console.log('Success', data.QueueUrl);
        resolve(data.QueueUrl);
      }
    });
  });
};


const pubMessage = (topic, message = {}, msgAttr = {}) => {
  return new Promise((resolve, reject) => {
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#publish-property
    const params = {
      TopicArn: topic, // topic name
      Message: JSON.stringify(message), /* required */ // json object
      MessageAttributes: msgAttr,
    };
    sns.publish(params, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      } else {
        console.log(data); // successful response
        resolve(data);
      }
    });
  });
};

const deleteMessage = (qUrl, receiptHandle) => {
  const deleteParams = {
    QueueUrl: qUrl,
    ReceiptHandle: receiptHandle,
  };

  return new Promise((resolve, reject) => {
    sqs.deleteMessage(deleteParams, (err, data) => {
      if (err) {
        console.log('Delete Error', err);
        reject(err);
      } else {
        console.log('Message Deleted', data);
        resolve(data);
      }
    });
  });
};

const receiveMessage = (qUrl) => {  
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#receiveMessage-property
  const params = {
    QueueUrl: qUrl,
    AttributeNames: [
      'All',
    ],
    MessageAttributeNames: [
      'All',
    ],
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0,
  };
  return new Promise((resolve, reject) => {
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.log('Receive Error', err);
        reject(err);
      } else {
        resolve(data);
        deleteMessage(qUrl, data.Messages[0].ReceiptHandle);
      }
    });
  });
};

const sendMessageToQ = (msg) => {
  const params = {
    MessageBody: msg,
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou_RE_searchQuery', 
    DelaySeconds: 0,
  };
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      } else {
        console.log(data); // successful response
        resolve(err);
      }
    });
  });
};

class sqsWorker {
  constructor(qUrl, messageHandler, sqs = sqs) {
    this.worker = Consumer.create({
      queueUrl: qUrl,
      handleMessage: messageHandler,
      waitTimeSeconds: 20,
      batchSize: 10,
      sqs,
    });
    this.worker.on('error', (err) => {
      console.log(err.message);
    });
  }

  start() {
    this.worker.start();
  }

  stop() {
    this.worker.stop();
  }
}

const publish = () => {
  console.log('now publishing')
  pubMessage('arn:aws:sns:us-west-1:587282304975:iRecYou_recsList', {'hello': 'world'})
  .then(result => {
    console.log('finished publishing and now receiveMessage from SQS');
    return receiveMessage('https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou');
  }).then(data => {
    console.log('message from SQS:');
    console.log(data);
  }).catch(e => {
    console.log(e);
  });
}
  
module.exports.sqs = sqs;
module.exports.sns = sns;
module.exports.listQ = listQ;
module.exports.getQUrl = getQUrl;
module.exports.pubMessage = pubMessage;
module.exports.receiveMessage = receiveMessage;
module.exports.sendMessageToQ = sendMessageToQ;
module.exports.sqsWorker = sqsWorker;

