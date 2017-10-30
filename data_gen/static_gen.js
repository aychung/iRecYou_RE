const fs = require('fs');
const util = require('../util');
const db = require('../database/index.js');

const newRandom = util.getGaussianRandom(0, 0.01);

const wordListPath = './generator/words.txt';
const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');

const category = [
  'Auto & Vehicles',
  'Beauty & Fashion',
  'Comedy',
  'Education',
  'Entertainment',
  'Family Entertainment',
  'Film & Animation',
  'Food',
  'Gaming',
  'How-to & Style',
  'Music',
  'News & Politics',
  'Nonprofits & Activism',
  'People & Blogs',
  'Pets & Animals',
  'Science & Technology',
  'Sports',
  'Travel & Events',
];

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
  'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
  'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
  'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
  'WI', 'WY'
];

const sentiments = [
  'pleasant', 'unpleasant',
];

const genTitle = () => {
  let result = '';
  let length = Math.ceil(Math.random() * 6);
  for (let i = 0; i < length; i++) {
    result += wordArray[Math.floor(wordArray.length*Math.random())];
    if (i !== length - 1) {
      result += ' ';
    }
  }
  return result;
};

// // will have total 500,000 videos
// const createVideo = () => {
//   const result = {};
//   // generate title
//   result.title = genTitle();
//
//   // generate category
//   result.category = category[Math.floor(category.length*Math.random())];
//
//   // generate like counts
//   result.like_counts = Math.abs(Math.floor(newRandom() * 10000));
//
//   // generate comment_counts
//   result.comment_counts = Math.abs(Math.floor(newRandom() * 1000));
//
//   // generate view_counts
//   result.view_counts = Math.abs(Math.floor(newRandom() * 1000000));
//
//   // generate created_at
//   result.created_at = util.randomDate(new Date(2017, 3, 1), new Date(2017, 6, 1));
//
//   return result;
// };

// will have total 500,000 videos
const createVideoString = (i) => {
  let result = '';

  // generate id
  result += i.toString() + ',';
  // generate title
  result += genTitle() + ',';
  // generate category
  result += category[Math.floor(category.length*Math.random())] + ',';
  // generate like counts
  result += Math.abs(Math.floor(newRandom() * 10000)) + ',';
  // generate comment_counts
  result += Math.abs(Math.floor(newRandom() * 1000)) + ',';
  // generate view_counts
  result += Math.abs(Math.floor(newRandom() * 1000000)) + ',';
  // generate created_at
  const date = util.randomDate(new Date(2017, 3, 1), new Date(2017, 6, 1));
  result += '2017-' + util.pad2(date.getMonth()+1) + '-' + util.pad2(date.getDate()) + '\n';

  return result;
};


// // will have total 1,000,000 users
// const createUser = () => {
//   const result = {};
//
//   result.demograph = states[Math.floor(states.length * Math.random())];
//
//   return result;
// };

const createUserString = (i) => {
  return i.toString() + ',' + states[Math.floor(states.length * Math.random())] + '\n';
};

// const createLike = () => {
//   const result = {};
//   result.vidId = Math.floor(Math.random() * 500000);
//   result.userId = Math.floor(Math.random() * 1000000);
//   return result;
// };

const createLikeString = (i, v, u) => {
  let result = '';
  result += i.toString() + ',';
  result += v.toString() + ',';
  result += u.toString() + '\n';
  return result;
};

// const createCommentSentiment = () => {
//   const result = {};
//   result.vidId = Math.floor(Math.random() * 500000);
//   result.userId = Math.floor(Math.random() * 1000000);
//   result.sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
//   return result;
// };

const createCommentSentimentString = (i, v, u) => {
  let result = '';
  result += i.toString() + ',';
  result += v.toString() + ',';
  result += u.toString() + ',';
  result += sentiments[Math.floor(Math.random() * sentiments.length)] + '\n';
  return result;
};


//  const genVid = async () => {
//   let promises = [];
//   for (var i = 1; i <= 500000; i++) {
//     try {
//       promises.push(db.saveVideos(createVideo()));
//     } catch (e) {
//       console.log(e);
//       break;
//     }
//     if (i % 100 === 0) {
//       await Promise.all(promises);
//       promises = [];
//       if (i % 10000 === 0) {
//         console.log('done inserting', i);
//       }
//     }
//   }
// };

 const genVidCsv = () => {
  let temp = '';
  for (let i = 1; i <= 500000; i++) {
    temp += createVideoString(i);
    if (i % 1000 === 0) {
      fs.appendFileSync('./database/v.csv', temp);
      temp = '';
      if (i % 10000 === 0) {
        console.log('done inserting', i);
      }
    }
  }
};

// // 100000000
// const genU = async () => {
//   let promises = [];
//
//   for (let i = 0; i < 1000000; i++) {
//     try{
//       promises.push(db.saveUsers(createUser()));
//     } catch (e) {
//       console.log(e);
//       break;
//     }
//     if (i % 100 === 0) {
//       await Promise.all(promises);
//       promises = [];
//       if (i % 10000 === 0) {
//         console.log('done inserting', i);
//       }
//     }
//   }
// };

const genUCsv = () => {
  let temp = '';

  for (let i = 1; i <= 1000000; i++) {
    temp += createUserString(i);
    if (i % 1000 === 0) {
      fs.appendFileSync('./database/u.csv', temp);
      temp = '';
      if (i % 10000 === 0) {
        console.log('done inserting', i);
      }
    }
  }
};

const genLikesCsv = async () => {
  const totalVid = 500000;
  const totalUser = 1000000;
  let count = 1;

  console.log('vidoes:', totalVid, ', users:', totalUser);

  let tempstring = '';
  for (let i = 1; i <= totalVid; i++) {
    let temp = {};
    let likes;

    try{
      likes = await db.Videos.findOne({
        attributes: ['like_counts'],
        where: {
          id: i,
        }
      });
    } catch(e) {
      console.log(e);
      break;
    }
    for (let j = 0; j < likes.like_counts; j++) {
      let tempU = 0;
      do {
        tempU = Math.ceil(Math.random() * totalUser);
      } while (temp[tempU]);
      temp[tempU] = tempU;
      tempstring += createLikeString(count, i, tempU);
      count += 1;
    }
    if (i % 100 === 0) {
      fs.appendFileSync('./database/l.csv', tempstring);
      tempstring = '';
      if (i % 1000 === 0) {
        console.log('done inserting', i);
      }
    }
  }
  console.log('created total', count, ' likes');
};

const genCommentSentimentsCsv = async () => {
  const totalVid = 500000;
  const totalUser = 1000000;
  // var totalVid = 100;
  // var totalUser = 100000000;
  let count = 1;

  // console.log('vidoes:', totalVid, ', users:', totalUser);

  let tempstring = '';
  for (let i = 1; i <= totalVid; i++) {
    let temp = {};
    let comments;

    try {
      comments = await db.Videos.findOne({
        attributes: ['comment_counts'],
        where: {
          id: i,
        }
      });
    } catch (e) {
      console.log(e);
      break;
    }
    for (let j = 0; j < comments.comment_counts; j++) {
      let tempU = 0;
      do {
        tempU = Math.ceil(Math.random() * totalUser);
      } while (temp[tempU]);
      temp[tempU] = tempU;
      tempstring += createCommentSentimentString(count, i, tempU);
      count += 1;
    }
    if (i % 100 === 0){
      fs.appendFileSync('./database/cs.csv', tempstring);
      tempstring = '';
      if (i % 1000 === 0) {
        console.log('done inserting', i);
      }
    }
  }
  console.log('created total', count, ' commentSentiments');
};




// genVid();
// genVidCsv();
// genU();
// genUCsv();
// genLikesCsv();
// genCommentSentimentsCsv();





