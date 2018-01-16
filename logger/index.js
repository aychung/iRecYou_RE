const elasticsearch = require('elasticsearch');
const {and, gte, lte} = require('sequelize').Op;
const winston = require('winston');
const WinstonES = require('winston-elasticsearch');

const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'trace'
});

const esTransportOpts = {
  level: 'info',
  client,
  mappingTemplate: './index-template-mapping.json',
};

const logger = new winston.Logger({
  transports: [
    new WinstonES(esTransportOpts),
  ],
});

logger.emitErrs = true;
logger.on('error', function (err) {
  console.log(`> LOGGER ERROR: ${err}`);
});

const esPing = () => {
  client.ping({
    requestTimeout: 30000,
  }, function (error) {
    if (error) {
      console.error('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });
};

const esDelete = (indexName = '', typeName = '', id = '') => {
  return client.delete({index: indexName, type: typeName, id: id});
};

const esCreateIndex = (indexName) => {
  if (indexName) {
    client.indices.create({
      index: indexName,
    }).then(resp => {
      console.log(resp);
    }).catch(e => {
      console.log(e);
    });
  } else {
    throw new Error('no index name');
  }
};

const esIndexMapping = (indexName, typeName, props) => {
  return client.indices.putMapping({
    index: indexName,
    type: typeName,
    body: {
      properties: props
    }
  }).then(resp => {
    console.log(resp);
  }).catch(e => {
    console.log(e);
  });
};

const esIndexMappingVideos = () => {
  esIndexMapping('irecyou_re', 'videos', {
      id: {type: 'integer'},
      title: {type: 'text'},
      category: {type: 'keyword'},
      like_counts: {type: 'integer'},
      comment_counts: {type: 'integer'},
      view_counts: {type: 'integer'},
      created_at: {type: 'date'},
    });
};

const esIndexMappingUsers = () => {
  esIndexMapping('irecyou_re', 'users', {
    id: {type: 'integer'},
    demograph: {type: 'keyword'},
  });
};

const esIndexMappingLikes = () => {
  esIndexMapping('irecyou_re', 'likes', {
    vid_id: {type: 'integer'},
    u_id: {type: 'integer'},
  });
}

const esIndexMappingCommentSentiments = () => {
  esIndexMapping('irecyou_re', 'comment_sentiments', {
    vid_id: {type: 'integer'},
    u_id: {type: 'integer'},
    sentiment: {type: 'keyword'}
  });
};

const esBulkIndex = async ( model ) => {
  let total, bulk;
  try {
    total = await model.count();
  } catch (e) {
    console.log(e);
    return;
  }
  for ( let i = 0; i < Math.ceil(total / 1000); i ++) {
    let rows;
    try {
      rows = await model.findAll({
        where: {
          [and]:[
            {id: {[gte]: (i*1000 + 1)}},
            {id: {[lte]: ((i+1)*1000)}}
          ]
        }
      });
    } catch (e) {
      console.log(e);
      break;
    }

    bulk = [];
    for (let j = 0; j < rows.length; j++) {
      bulk.push({index: {
        _index:'irecyou_re',
        _type: model.tableName,
        _id: (i*1000 + j+1)
      }});
      let item = {};
      for (let key in rows[j].dataValues) {
        if( rows[j].dataValues.hasOwnProperty(key) ) {
          item[key] = rows[j].dataValues[key];
        }
      }
      bulk.push(item);
    }
    try {
      await client.bulk({body: bulk});
    } catch (e) {
      console.log(e);
      break;
    }
    console.log('inserted ', ((i+1) *1000));
  }
  console.log('finished');
};

const esBulkIndexVideos = () => {
  console.log('starting indexing videos');
  return esBulkIndex(db.Videos);
};

const esBulkIndexUsers = () => {
  console.log('starting indexing users');
  return esBulkIndex(db.Users);
};

const esBulkIndexLikes = () => {
  console.log('starting indexing likes');
  return esBulkIndex(db.Likes);
};

const esBulkIndexCommentSentiments = () => {
  console.log('starting indexing comment sentiments');
  return esBulkIndex(db.CommentSentiments);
};

const indexAll = async () => {
  try {
    await esBulkIndexVideos();
    await esBulkIndexUsers();
    await esBulkIndexLikes();
    await esBulkIndexCommentSentiments();
  } catch (e) {
    console.log(e);
  }
  console.log('all finished');
};

module.exports.esClient = client;
module.exports.logger = logger;
module.exports.logger.stream = {
  write: function(message, encoding){
      logger.info(message);
  }
};
