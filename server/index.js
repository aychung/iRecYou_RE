const express = require('express');
const RE = require('../recommender');

const app = express();

app.get('/', (req, res) => {
  let result ='Hello World!';
  res.send(result);
});

app.get('/rec_list/vid/:id', (req, res) => {
  RE.rListFromVid(req.params.id)
    .then(resp => {
       let temp = {};
       temp[req.params.id] = resp;
       res.send(temp);
    });
});

app.get('/rec_list/search/:query', (req, res) => {
   RE.rListFromSearch(req.params.query)
    .then(resp => {
      let temp = {};
      temp[req.params.query] = resp;
      res.send(temp);
    });
});

const server = app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

module.exports = server;
