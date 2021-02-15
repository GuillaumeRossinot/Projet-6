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
  var usersliked = new Array();
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: usersliked,
    usersDisliked: usersliked
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

// modifie 1 sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// Supprimer 1 sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
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

// toutes les fonctions pour la gestion des likes/dislikes

function verifLike(indexUser, sauceLike, userId) {
  console.log("entrer dans  verif like ");
  if (indexUser >= 0 && userId == sauceLike.usersLiked[indexUser]) {
    var retour = true;
    console.log("Userid dans userliked : " + userId);

  } else {

    var retour = false;

  }

  console.log("Sortie verif like : " + retour);
  return retour;
};

function verifDislike(indexUser, sauceLike, userId) {
  console.log("entrer dans verif dislike ");
  if (indexUser >= 0 && userId == sauceLike.usersDisliked[indexUser]) {
    var retour = true;
    console.log("Userid dans userdisliked : " + userId);

  } else {

    var retour = false;

  }
  console.log("Sortie verif dislike : " + retour);
  return retour;
};

function addLike(userIdlike, sauceLike, idSauce) {
  console.log("entrer dans add like ");
  sauceLike.likes += 1;
  sauceLike.usersLiked.push(userIdlike);

  const queryCondition = { _id: idSauce };

  const queryUpdate = {
    $set: {
      usersLiked:
        sauceLike.usersLiked,
      likes: sauceLike.likes,
    },
  };

  var retour = [queryCondition, queryUpdate];

  console.log("Sortie addlike : " + retour);
  return retour;

};

function addDislike(userIdlike, sauceLike, idSauce) {
  console.log("entrer dans add dislike ");
  sauceLike.dislikes += 1;
  sauceLike.usersDisliked.push(userIdlike);

  const queryCondition = { _id: idSauce };

  const queryUpdate = {
    $set: {
      usersDisliked:
        sauceLike.usersDisliked,
      dislikes: sauceLike.dislikes,
    },
  };

  var retour = [queryCondition, queryUpdate];

  console.log("Sortie add dislike : " + retour);
  return retour;

};

function removeLike(indexUser, sauceLike, idSauce) {
  console.log("entrer dans remove like ");
  sauceLike.likes -= 1;
  delete sauceLike.usersLiked[indexUser];
  sauceLike.usersLiked = nettoyerArray(sauceLike.usersLiked);

  const queryCondition = { _id: idSauce };

  const queryUpdate = {
    $set: {
      usersLiked:
        sauceLike.usersLiked,
      likes: sauceLike.likes,
    },
  };

  var retour = [queryCondition, queryUpdate];

  console.log("Sortie remove like : " + retour);
  return retour;
}

function removeDislike(indexUser, sauceLike, idSauce) {
  console.log("entrer dans remove dislike ");
  sauceLike.dislikes -= 1;
  delete sauceLike.usersDisliked[indexUser];
  sauceLike.usersDisliked = nettoyerArray(sauceLike.usersDisliked);

  const queryCondition = { _id: idSauce };

  const queryUpdate = {
    $set: {
      usersDisliked:
        sauceLike.usersDisliked,
      dislikes: sauceLike.dislikes,
    },
  };

  var retour = [queryCondition, queryUpdate];

  console.log("Sortie remove dislike : " + retour);

  return retour;
}


function nettoyerArray(tableau) {

  var cleanArray = tableau.filter(function () { return true });
  return cleanArray;
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
    .then(
      (sauce) => {
        const sauceUpdate = sauce;
        let userId = req.body.userId;
        let indexUsersLiked = sauceUpdate.usersLiked.indexOf(userId);
        let indexUsersDisliked = sauceUpdate.usersDisliked.indexOf(userId);
        let queryDetails = [];

        if (req.body.like == 1) {
          if (verifLike(indexUsersLiked, sauceUpdate, userId) == false) {

            queryDetails = addLike(userId, sauceUpdate, req.params.id);

          } else {
            res.status(200).json({ message: "L'user a deja like" })
          }

        } else if (req.body.like == -1) {

          if (verifDislike(indexUsersDisliked, sauceUpdate, userId) == false) {

            queryDetails = addDislike(userId, sauceUpdate, req.params.id);

          } else {
            res.status(200).json({ message: "L'user a deja dislike" })
          }

        } else if (req.body.like == 0) {
          if (indexUsersLiked >= 0) {

            queryDetails = removeLike(indexUsersLiked, sauceUpdate, req.params.id);

          }

          if (indexUsersDisliked >= 0) {

            queryDetails = removeDislike(indexUsersDisliked, sauceUpdate, req.params.id);

          }

        } else {
          res.status(400).json({ message: 'Erreur sur la valeur like !' })
        }

        Sauce.updateOne(queryDetails[0], queryDetails[1])
          .then(() => res.status(200).json({ message: 'Objet modifié !' }))
          .catch(error => res.status(400).json({ error }));

      }
    )
    .catch(
      error => {
        res.status(404).json({
          error
        });
      }
    );
};

