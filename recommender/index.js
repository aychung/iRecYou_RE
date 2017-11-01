//const ES = require('../elasticsearch');
const db = require('../database');

const rListFromVid = (vidId) => {
  return db.Videos.count()
    .then(c => {
      const result = [];
      while (result.length !== 8) {
        let temp;
        do {
          temp = Math.floor(Math.random() * c);
        } while (result.indexOf(temp) !== -1);
        result.push(temp)
      }
      return result;
    });
};

const rListFromSearch = (query) => {

  return db.Videos.count()
    .then(c => {
      const result = [];
      while (result.length !== 4) {
        let temp;
        do {
          temp = Math.floor(Math.random() * c);
        } while (result.indexOf(temp) !== -1);
        result.push(temp)
      }
      return result;
    });
};

module.exports.rListFromVid = rListFromVid;
module.exports.rListFromSearch = rListFromSearch;
