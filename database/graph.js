// neo4j cypher helper module
const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'));
const session = driver.session();

const addManyUsers = (users) => {
  return session.run(
    `UNWIND $users AS user
     CREATE (u:User {id: user.id, demograph: user.demograph})
     RETURN u`,
    { users: users }
  )
  .then(result => result)
  // ).then(result => console.log(result))
  .catch(err => {
    console.log(err);
    session.close();
  });
};

const addManyVideos = (videos) => {
  return session.run(
    `UNWIND $videos AS video
     CREATE (v:Video {id: video.id, title: video.title, category: video.category, created_at: video.created_at})
     RETURN v`,
     { videos : videos }
  ).then(result => result)
  // ).then(result => console.log(result))
  .catch(err => {
    console.log(err);
    session.close();
  });
};

const batchLikes = (likes) => {
  return session.run(
    `UNWIND $likes AS like
     MATCH (a:User { id: like.u_id }), (b:Video { id: like.vid_id })
     MERGE (a)-[:LIKES]->(b)
     RETURN a`,
     { likes: likes }
  // ).then(result => console.log(result))
  ).then(result => result)
  .catch(err => {
    console.log(err);
    session.close();
  });
};

const batchComments = (commentSentiments) => {
  return session.run(
    `UNWIND $commentSentiments AS cs 
     MATCH (a:User { id: cs.u_id }), (b:Video { id: cs.vid_id })
     MERGE (a)-[:COMMENTED {sentiment: cs.sentiment}]->(b)
     RETURN a`,
     { commentSentiments: commentSentiments }
  // ).then(result => console.log(result))
  ).then(result => result)
  .catch(err => {
    console.log(err);
    session.close();
  });
};

const getRListFromVidId = (vid_id) => {
  return session.run(
    `MATCH (v:Video {id: ${vid_id.toString()}})<-[:LIKES]-(u:User) 
    MATCH (u)-[:LIKES]->(v1:Video)
    WHERE NOT v = v1
    RETURN v1, count(DISTINCT v1) as frequency
    ORDER BY frequency DESC
    LIMIT 8`,
  ).then(result => {
    session.close();
    const ret = [];
    result.records.forEach(val => {
      ret.push(val.get('v1').properties.id);
    })
    return ret;
  }).catch(err => {
    console.log(err);
    session.close();
  });
}
const getRListFromQeury = (query) => {
  return session.run(
    `MATCH (v:Video) 
    WHERE v.title CONTAINS "${query}"
    MATCH (v)<-[l:LIKES]-(u:User)
    RETURN v, count(l) as l_count
    ORDER BY l_count DESC
    LIMIT 4`,
  ).then(result => {
    session.close();
    const ret = [];
    result.records.forEach(val => {
      ret.push(val.get('v').properties.id);
    })
    return ret;
  }).catch(err => {
    console.log(`> getRListFromQeury ERROR: ${query},${err}`);
    session.close();
  });
}

module.exports.addManyUsers = addManyUsers;
module.exports.addManyVideos = addManyVideos;
module.exports.batchLikes = batchLikes;
module.exports.batchComments = batchComments;
module.exports.session = session;
module.exports.getRListFromVidId = getRListFromVidId;
module.exports.getRListFromQeury = getRListFromQeury;

