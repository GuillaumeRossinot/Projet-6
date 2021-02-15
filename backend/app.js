const express = require('express'),
  app = express(),
  sauceRoutes = require('./routes/sauceroutes'),
  userRoutes = require('./routes/user'),
  path = require('path'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose')
//  ejs = require('ejs')


app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
//app.use(bodyParser.raw({type: 'multipart/form-data'}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// identifiant de connection a la bdd
mongoose.connect('mongodb+srv://DbUser:CoUserPassword@cluster0.hxcun.mongodb.net/projet6?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app; 
