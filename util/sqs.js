const AWS = require('aws-sdk');

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {};

sqs.listQueues(params, function(err, data) {
    if (err) {
          console.log("Error", err);
            } else {
                  console.log("Success", data.QueueUrls);
                    }
});

