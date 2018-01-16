const db = require('../database/index.js');
const graph = require('./graph.js');
const {and, gte, lte} = require('sequelize').Op;


const esBulkIndex = async ( model, modelCount ) => {
  let total, result;
  if(modelCount){
    total = modelCount;
  } else {
    try {
      total = await model.count();
    } catch (e) {
      console.log(e);
      return;
    }
  }
  const step = 10000;
  for ( let i = 0; i < Math.ceil(total / step); i ++) {
    let rows;
    try {
      rows = await model.findAll({
        where: {
          [and]:[
            {id: {[gte]: (i*step + 1)}},
            {id: {[lte]: ((i+1)*step)}}
          ]
        },
        raw: true,
      });
    } catch (e) {
      console.log(e);
      break;
    }
    try {
      if (model.tableName === 'videos') {
        result = await graph.addManyVideos(rows);
      } else if (model.tableName === 'users') {
        result = await graph.addManyUsers(rows);        
      } else if (model.tableName === 'likes') {
        result = await graph.batchLikes(rows);
      } else if (model.tableName === 'comment_sentiments') {
        result = await graph.batchComments(rows);
      }
    } catch (e) {
      console.log(e);
      break;
    }
    console.log('inserted ', ((i+1) * step));
  }
  console.log('finished');
  return result;
};

const transferAll = async () => {
  console.log('inserting videos');
  await esBulkIndex(db.Videos);
  console.log('inserting users');
  await esBulkIndex(db.Users);
  console.log('inserting likes');
  await esBulkIndex(db.Likes, 39867188);
  console.log('inserting comments');
  await esBulkIndex(db.CommentSentiments, 3992877);
  console.log('all done');
  graph.session.close();
}

// transferAll();





