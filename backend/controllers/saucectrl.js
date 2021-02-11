const Sauce = require('../models/sauce');

//Recupere 1 sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Ajout new sauce
exports.createSauce = (req, res, next) => {
  console.log("sauce :" + req.body.userId);
  console.log("name :" + req.body.name);
  console.log("reqbody :" + JSON.stringify(req.body.userId));
/*   user.findById({ id: req.body.userId })
  .then(sauceUser => {
    if (!sauceUser) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
  })
  .catch(error => res.status(500).json({ error })); */

  const sauce = new Sauce({
    // userId: ,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: 4,
    dislikes: 5,
    userLiked: [],
    userDisliked: []
    
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

 /* exports.modifySauce = (req, res, next) => {
  const sauce = new Sauce({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    userLiked: req.body.userLiked,
    userDisliked: req.body.userDisliked
  });
  Thing.updateOne({_id: req.params.id}, thing).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};  */

// Supprimer 1 sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
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