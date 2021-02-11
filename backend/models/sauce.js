const mongoose = require('mongoose');

// creer le schema sauce dans la bdd
const sauceSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  name: { type: String },
  manufacturer: { type: String },
  description: { type: String },
  mainPepper: { type: String },
  imageURL: { type: String },
  heat: { type: Number },
  likes: { type: Number },
  dislikes: { type: Number },
  userLiked: [ { type: mongoose.Schema.Types.ObjectId, ref: "User"} ],
  userDisliked: [ { type: mongoose.Schema.Types.ObjectId, ref: "User"} ]
});

module.exports = mongoose.model('sauce', sauceSchema);