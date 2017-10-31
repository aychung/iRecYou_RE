const express = require('express');
// const RE = require('../recommender');

const app = express();

app.get('/', (req, res) => {
//  console.log('here');
  let result ='Hello World!';
  res.send(result);
});

app.get('/rec_list/vid/:id', (req, res) => {
//  RE.recommenderListFromVid(req.params.id)
//    .then(resp => {
//      console.log(resp);
//      res.send(resp);
//    });
  let result = {};
  result[req.params.id] = [1,2,3,4];
  res.send(result);
});

app.get('/rec_list/search/:query', (req, res) => {
//  RE.recommenderListFromSearch(req.params.query)
//    .then(resp => {
//      res.send(resp);
//    });
  let result = {};
  result[req.params.query] = [1,2,3,4];
  res.send(result);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
