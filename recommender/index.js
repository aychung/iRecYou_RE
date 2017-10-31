//const ES = require('../elasticsearch');
const db = require('../database');

const recommenderListFromVid = (vidId) => {
//  return ES.esClient.search({
 //   index: 'irecyou_re',
 //   type: 'videos',
 //   body: {
 //     query: {
 //       match: {
 //         id: vidId,
 //       },
 //     },
 //   },
 // }).then((body) => {
 //   return ['rList from Vid', body.hits.hits];
 // }, (error) => {
 //   console.trace(error.message);
 // });
};

const recommenderListFromSearch = (query) => {
 // return ES.esClient.search({
 //   index: 'irecyou_re',
 //   type: 'videos',
 //   body: {
 //     query: {
 //       match: {
 //         title: query,
 //       },
 //     },
 //   },
 // }).then((body) => {
 //   return ['rList from search', body.hits.hits];
 // }, (error) => {
 //   console.trace(error.message);
 // });
};

module.exports.recommenderListFromVid = recommenderListFromVid;
module.exports.recommenderListFromSearch = recommenderListFromSearch;
