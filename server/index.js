const express = require('express');
const RE = require('../recommender');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/rec_list/vid/:id', (req, res) => {
  RE.recommenderListFromVid(req.params.id)
    .then(resp => {
      console.log(resp);
      res.send(resp);
    });
});

app.get('/rec_list/search/:query', (req, res) => {
  RE.recommenderListFromSearch(req.params.query)
    .then(resp => {
      res.send(resp);
    });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

