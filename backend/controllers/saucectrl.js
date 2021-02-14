const Sauce = require('../models/sauce');
const fs = require('fs');
const user = require('../models/user');

//Recupere 1 sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
  .then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  )
  .catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Ajout new sauce
exports.createSauce = (req, res, next) => {
  console.log(req.body.sauce);
  var userliked = new Array();
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    userLiked: userliked,
    userDisliked: userliked
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

// Supprimer 1 sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Recupere toute les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


//todo : - ameliorer la vrification like/dislike
//- faire en sorte de pouvoir enlever le like/dislike si on a deja like/dislike

function verifLike(indexUser, sauceLike){
    if( indexUser == sauceLike.userLiked[indexUser] ){
       return 1;
    }
};

function verifDislike(indexUser, sauceLike){
  if( indexUser == sauceLike.userDisliked[indexUser] ){
    return 1;
 }
};

function addLike(userIdlike, sauceLike, idSauce){

  sauceLike.likes += 1;
  sauceLike.userLiked.push(userIdlike);

const queryCondition = { _id: idSauce };

const queryUpdate = {
  $set: {
    userLiked:
    sauceLike.userLiked,
    likes : sauceLike.likes,
  },
};

var retour = [queryCondition, queryUpdate];

console.log(retour);

return retour;

};

function addDislike(userIdlike, sauceLike, idSauce){

  sauceLike.dislikes += 1;
  sauceLike.userDisliked.push(userIdlike);

const queryCondition = { _id: idSauce };

const queryUpdate = {
  $set: {
    userDisliked : 
    sauceLike.userDisliked,
    dislikes : sauceLike.dislikes,
  },
};

var retour = [queryCondition, queryUpdate];

console.log(retour);

return retour;

};

function removeLike(indexUser, sauceLike, idSauce){

  sauceLike.likes -= 1;
  delete sauceLike.userLiked[indexUser];
  sauceLike.userLiked = nettoyerArray(sauceLike.userLiked);

const queryCondition = { _id: idSauce };

const queryUpdate = {
  $set: {
    userLiked:
    sauceLike.userLiked,
    likes : sauceLike.likes,
  },
};

var retour = [queryCondition, queryUpdate];

console.log(retour);

return retour;
}

function removeDislike(indexUser, sauceLike, idSauce){

  sauceLike.dislikes -= 1;
  delete sauceLike.userDisliked[indexUser];
  sauceLike.userDisliked = nettoyerArray(sauceLike.userDisliked);

const queryCondition = { _id: idSauce };

const queryUpdate = {
  $set: {
    userDisliked : 
    sauceLike.userDisliked,
    dislikes : sauceLike.dislikes,
  },
};

var retour = [queryCondition, queryUpdate];

console.log(retour);

return retour;
}


function nettoyerArray(tableau){

  var cleanArray = tableau.filter(function () { return true });
  return cleanArray;
};

exports.likeSauce = (req,res,next) => {
Sauce.findOne({
  _id: req.params.id
})
.then(
  (sauce) => {
  const sauceUpdate = sauce;
  var indexUserLiked = sauceUpdate.userLiked.indexOf(req.body.userId);
  var indexUserDisliked = sauceUpdate.userDisliked.indexOf(req.body.userId);
  var queryDetails = [];

  if(verifLike(indexUserLiked, sauceUpdate) == 1 && verifDislike(indexUserDisliked, sauceUpdate) == 1 ){

      if(req.body.like == 1 ){

      queryDetails = addLike(req.body.userId, sauceUpdate, req.params.id);
      

      }else if(req.body.like == -1){

        queryDetails = addDislike(req.body.userId, sauceUpdate, req.params.id);

      }else if (req.body.like == 0){
        if(indexUserLiked >= 0){
          
          queryDetails = removeLike(indexUserLiked, sauceUpdate, req.params.id);
          
        }

        if (indexUserDisliked >= 0){

          queryDetails = removeDislike(indexUserDisliked, sauceUpdate, req.params.id); 

        }

      }else {
        res.status(400).json({ message: 'Erreur sur la valeur like !' })
      } 

      Sauce.updateOne( queryDetails[0], queryDetails[1])
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
    } else {
      res.status(400).json({ message: "L'user a deja like/dislike" })
    }
  }
)
.catch(
  (error) => {
    res.status(404).json({
      error: error
    });
  }
);



/*   Sauce.updateOne({ _id: req.params.id }, { userLiked, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error })); */
};

