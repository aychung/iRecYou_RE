/*
=========================
Things to do in aws console
1. Setup Topic in SNS.
2. Setup SQS to subscribe SNS topic.
=========================
*/

const AWS = require('aws-sdk');
AWS.config.update({region:'us-west-1'});

// Create SQS and SNS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const sns = new AWS.SNS({apiVersion: '2010-03-31'});

const listQ = () => {
  return new Promise ((resolve, reject) => {
    sqs.listQueues({}, function(err, data) {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        console.log("Success", data.QueueUrls);
        resolve(data);
      }
    });
  });
}

const getQUrl = (qName) => { 
  return new Promise ((resolve, reject) => {
      sqs.getQueueUrl({QueueName: qName}, function(err, data) {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        console.log("Success", data.QueueUrl);
        resolve(data.QueueUrl);
      }
    });
  });
}


const pubMessage = (topic, message = {}, msgAttr = {}) => {
  return new Promise ((resolve, reject) => {
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#publish-property
    var params = {
      TopicArn: topic, // topic name
      Message: JSON.stringify(message), /* required */ // json object
      MessageAttributes: msgAttr,
      /*
      {
        '<String>': {
          DataType: 'STRING_VALUE', // required 
          StringValue: 'STRING_VALUE',
        },
        // '<String>': ... 
      },
      */
    };
    sns.publish(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      }
      else {
        console.log(data);           // successful response
        resolve(data);
      }
    });  
  });
};

const deleteMessage = (qUrl, receiptHandle) => {
  var deleteParams = {
    QueueUrl: qUrl,
    ReceiptHandle: receiptHandle,
  };
 
  return new Promise ((resolve, reject) => {
    sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log("Delete Error", err);
        reject(err);
      } else {
        console.log("Message Deleted", data);
        resolve(data);
      }
    });  
  });
};

const receiveMessage = (qUrl) => {  
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#receiveMessage-property
  var params = {
    QueueUrl: qUrl,
    AttributeNames: [
      "All"
    ],
    MessageAttributeNames: [
      "All"
    ],
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
  };
  return new Promise ((resolve, reject) => {
    sqs.receiveMessage(params, function(err, data) {
      if (err) {
        console.log("Receive Error", err);
        reject(err);
      } else {
        resolve(data);
        deleteMessage(qUrl, data.Messages[0].ReceiptHandle);
      }
    });
  });
}



// console.log('now publishing')
// pubMessage('arn:aws:sns:us-west-1:587282304975:iRecYou_recsList', {'hello': 'world'})
//   .then(result => {
//     console.log('finished publishing and now receiveMessage from SQS');
//     return receiveMessage('https://sqs.us-west-1.amazonaws.com/587282304975/iRecYou');
//   }).then(data => {
//     console.log('message from SQS:');
//     console.log(data);
//   }).catch(e => {
//     console.log(e);
//   });



module.exports.sqs = sqs;
module.exports.sns = sns;
module.exports.listQ = listQ;
module.exports.getQUrl = getQUrl;
module.exports.pubMessage = pubMessage;
module.exports.receiveMessage = receiveMessage;

