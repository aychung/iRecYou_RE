const dbWorker = require('../dbWorker');
var sinon = require('sinon');
var assert = require('chai').assert;


describe('dbWorker', function () {
  var consumer;
  var handleMessage;
  var sqs;
  var response = {
    Messages: [{
      ReceiptHandle: 'receipt-handle',
      MessageId: '123',
      Body: 'body'
    }]
  };

  beforeEach(function () {
    handleMessage = sinon.stub().yieldsAsync(null);
    sqs = sinon.mock();
    sqs.receiveMessage = sinon.stub().yieldsAsync(null, response);
    sqs.receiveMessage.onSecondCall().returns();
    sqs.deleteMessage = sinon.stub().yieldsAsync(null);
    sqs._deleteMessage = sinon.stub().yieldsAsync(null);
    sqs.changeMessageVisibility = sinon.stub().yieldsAsync(null);

    // consumer = new Consumer({
    //   queueUrl: 'some-queue-url',
    //   region: 'some-region',
    //   handleMessage: handleMessage,
    //   sqs: sqs,
    //   authenticationErrorTimeout: 20
    // });
    consumer = new dbWorker.sqsWorker('some-queue-url', handleMessage, sqs);
  });

  it('requires a queueUrl to be set', function () {
    assert.throws(function () {
      new dbWorker.sqsWorker( undefined, handleMessage, sqs);
    });
  });

  it('requires a handleMessage function to be set', function () {
    assert.throws(function () {
      new dbWorker.sqsWorker('some-queue-url', undefined,sqs);
    });
  });

  describe('constructor', function () {
    it('creates a new instance of a class dbWorker', function () {
      var consumer = new dbWorker.sqsWorker('some-queue-url', handleMessage, sqs);

      assert(consumer instanceof dbWorker.sqsWorker);
    });
  });

  describe('.start', function () {
    it('fires an error event when an error occurs receiving a message', function (done) {
      var receiveErr = new Error('Receive error');

      sqs.receiveMessage.yields(receiveErr);

      consumer.worker.on('error', function (err) {
        assert.ok(err);
        assert.equal(err.message, 'SQS receive message failed: Receive error');
        done();
      });

      consumer.start();
    });

    it('handles unexpected exceptions thrown by the handler function', function (done) {
      consumer = new dbWorker.sqsWorker('some-queue-url', 
        () => {throw new Error('unexpected parsing error');}, sqs);

      consumer.worker.on('processing_error', function (err) {
        assert.ok(err);
        assert.equal(err.message, 'Unexpected message handler failure: unexpected parsing error');
        done();
      });

      consumer.start();
    });

    it('fires a `processing_error` event when a non-`SQSError` error occurs processing a message', function (done) {
      var processingErr = new Error('Processing error');

      handleMessage.yields(processingErr);

      consumer.worker.on('processing_error', function (err, message) {
        assert.equal(err, processingErr);
        assert.equal(message.MessageId, '123');
        done();
      });

      consumer.start();
    });

    it('fires an `error` event when an `SQSError` occurs processing a message', function (done) {
      var sqsError = new Error('Processing error');
      sqsError.name = 'SQSError';

      handleMessage.yields(sqsError);

      consumer.worker.on('error', function (err, message) {
        assert.equal(err, sqsError);
        assert.equal(message.MessageId, '123');
        done();
      });

      consumer.start();
    });

    it('calls the handleMessage function when a message is received', function (done) {
      consumer.start();

      consumer.worker.on('message_processed', function () {
        sinon.assert.calledWith(handleMessage, response.Messages[0]);
        done();
      });
    });

    it('consumes another message once one is processed', function (done) {
      sqs.receiveMessage.onSecondCall().yields(null, response);
      sqs.receiveMessage.onThirdCall().returns();

      consumer.start();
      setTimeout(function () {
        sinon.assert.calledTwice(handleMessage);
        done();
      }, 10);
    });

    it('doesn\'t consume more messages when called multiple times', function () {
      sqs.receiveMessage = sinon.stub().returns();
      consumer.start();
      consumer.start();
      consumer.start();
      consumer.start();
      consumer.start();

      sinon.assert.calledOnce(sqs.receiveMessage);
    });

    it('consumes multiple messages when the batchSize is greater than 1', function (done) {
      sqs.receiveMessage.yieldsAsync(null, {
        Messages: [
          {
            ReceiptHandle: 'receipt-handle-1',
            MessageId: '1',
            Body: 'body-1'
          },
          {
            ReceiptHandle: 'receipt-handle-2',
            MessageId: '2',
            Body: 'body-2'
          },
          {
            ReceiptHandle: 'receipt-handle-3',
            MessageId: '3',
            Body: 'body-3'
          }
        ]
      });

      consumer = new dbWorker.sqsWorker('some-queue-url', handleMessage, sqs);

      consumer.start();

      setTimeout(function () {
        sinon.assert.callCount(handleMessage, 3);
        done();
      }, 10);
    });

    it('fires a emptyQueue event when all messages have been consumed', function (done) {
      sqs.receiveMessage.yieldsAsync(null, {});

      consumer.worker.on('empty', function () {
        done();
      });

      consumer.start();
    });
  });
  describe('.stop', function () {
    beforeEach(function () {
      sqs.receiveMessage.onSecondCall().yieldsAsync(null, response);
      sqs.receiveMessage.onThirdCall().returns();
    });

    it('stops the consumer polling for messages', function (done) {
      consumer.start();
      consumer.stop();

      setTimeout(function () {
        sinon.assert.calledOnce(handleMessage);
        done();
      }, 10);
    });

    it('fires a stopped event when last poll occurs after stopping', function (done) {
      var handleStop = sinon.stub().returns();

      consumer.worker.on('stopped', handleStop);

      consumer.start();
      consumer.stop();

      setTimeout(function () {
        sinon.assert.calledOnce(handleStop);
        done();
      }, 10);
    });

    it('fires a stopped event only once when stopped multiple times', function (done) {
      var handleStop = sinon.stub().returns();

      consumer.worker.on('stopped', handleStop);

      consumer.start();
      consumer.stop();
      consumer.stop();
      consumer.stop();

      setTimeout(function () {
        sinon.assert.calledOnce(handleStop);
        done();
      }, 10);
    });

    it('fires a stopped event a second time if started and stopped twice', function (done) {
      var handleStop = sinon.stub().returns();

      consumer.worker.on('stopped', handleStop);

      consumer.start();
      consumer.stop();
      consumer.start();
      consumer.stop();

      setTimeout(function () {
        sinon.assert.calledTwice(handleStop);
        done();
      }, 10);
    });
  });
});


