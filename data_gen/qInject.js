const fs = require('fs');
// const aws = require('../util/aws.js');
const axios = require('axios');

const wordListPath = './data_gen/words.txt';
const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
const trendingWordArray = fs.readFileSync('./data_gen/trendingWords.txt', 'utf8').split('\n');


setInterval(() => {
  const tempMsg;
  if(Math.random() > .3) {
    tempMsg = trendingWordsArray[Math.floor(trendingWordsArray.length * Math.random())];
  } else {
    tempMsg = wordArray[Math.floor(wordArray.length * Math.random())];
  }
  
  axios.get(`http://127.0.0.1:3000/rec_list/search/${tempMsg}`)
    .then(response => console.log(response.data))
    .catch(error => console.log(error));
}, 200);



// // generate trending words file
// const trendingWords = [];
// const temp = {};
// while (trendingWords.length < 10000) {
//   const tempIndex = Math.floor(Math.random() * wordArray.length);
//   if (!(temp[wordArray[tempIndex]])) {
//     temp[wordArray[tempIndex]] = 1;
//     trendingWords.push(wordArray[tempIndex]);
//     fs.appendFileSync('./data_gen/trendingWords.txt', `${wordArray[tempIndex]}\n`);
//   }
//   if (trendingWords.length % 1000 === 0) {
//     console.log(trendingWords.length);
//   }
// }
