const Sequelize = require('sequelize');
const sequelize = new Sequelize('irecyou', '', '', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const Videos = sequelize.define('video', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: Sequelize.STRING(100),
  category: Sequelize.STRING(30),
  like_counts: Sequelize.INTEGER,
  comment_counts: Sequelize.INTEGER,
  view_counts: Sequelize.INTEGER,
  created_at: Sequelize.DATE,
}, {
  timestamps: false,
});

const Users = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  demograph: Sequelize.STRING(2),
}, {
  timestamps: false,
});

const Likes = sequelize.define('like', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vid_id: Sequelize.INTEGER,
  u_id: Sequelize.INTEGER,
},{
  timestamps: false,
});

const CommentSentiments = sequelize.define('comment_sentiment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vid_id: Sequelize.INTEGER,
  u_id: Sequelize.INTEGER,
  sentiment: Sequelize.STRING(20),
},{
  timestamps: false,
});

// Users.belongsToMany(Videos, {as: 'LikeVids', through: Likes, foreignKey: u_id});
// Videos.belongsToMany(Users, {as: 'Likers', through: Likes, foreignKey: vid_id});
// Users.belongsToMany(Videos, {as: 'CommentedVids', through: commentSentiments, foreignKey: u_id});
// Videos.belongsToMany(Users, {as: 'Commenters', through: commentSentiments, foreignKey: vid_id});

// Users.belongsToMany(Videos, {as: 'LikeVids', through: Likes});
// Videos.belongsToMany(Users, {as: 'Likers', through: Likes});
// Users.belongsToMany(Videos, {as: 'CommentedVids', through: CommentSentiments});
// Videos.belongsToMany(Users, {as: 'Commenters', through: CommentSentiments});


const saveVideos = (vidInfo) => {
  return Videos.create(vidInfo);
}

const saveUsers = (user) => {
  return Users.create(user);
}

const saveLikes = (like) => {
  return Likes.create(like);
}

const saveCommentSentiments = (commentSentiment) => {
  return CommentSentiments.create(commentSentiment)
}

module.exports = {
  saveVideos,
  saveUsers,
  saveLikes,
  saveCommentSentiments,
  Users,
  Videos,
  Likes,
  CommentSentiments,
};
