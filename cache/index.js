const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();

client.on('error', (err) => {
  console.log(`Error ${err}`);
});

// client.setexAsync('key', 3600, 'some value')
//   .then(result => {
//     console.log('setex>', result);
//     return client.getAsync('key');
//   }).then(result => {
//     console.log('get>', result);
//   });

module.exports.client = client;
