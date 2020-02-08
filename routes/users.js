var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const user = require('../models/user');
const parser = require('body-parser');
var app = express()


app.disable('etag');
//****************** s'inscrire ***************** */
router.post('/ajout', (req, res, next) => {

  user.findOne({ 'utilisateur': req.body.utilisateur }, function (err, us) {
    if (!us) {
      let u = new user(
        {
          nom: req.body.nom,
          prenom: req.body.prenom,
          motdepasse: bcrypt.hashSync(req.body.motdepasse, bcrypt.genSaltSync(10)),
          utilisateur: req.body.utilisateur,
          adresse: req.body.adresse,
          telephone: req.body.telephone
        })
      u.save((err) => {
        if (err) {
          console.log("erreur lors de l'ajout!");
          return;
        }
        res.status(200).json(us);
      })
    } else {
      res.status(401)
      res.send("utilisateur existe")
    }
  });

})
/* GET users listing. */
router.get('/', function (req, res, next) {
  // Disable caching for content files
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  user.find({})
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      console.log(err);
    });
});
//*********** get by id ******/
router.get('/details/:id', function (req, res) {

  let query = { "_id": req.params.id }
  user.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(res.send(err))
      res.send("Erreur !")
    }
    res.send(user);
  });
})

//*********** Login******/
router.post('/login', (req, res) => {
  let query = { "utilisateur": req.body.utilisateur }
  user.findOne(query, (err, usr) => {
    if (err) {
      res.send(err);
    }
    if (!usr) {
      res.status(401).json({ success: false })
    }
    else {
      console.log(usr.motdepasse)
      if (bcrypt.compareSync(req.body.motdepasse, usr.motdepasse)) {
        var token = jwt.sign({ utilisateur: usr.utilisateur }, 's3cr3t', { expiresIn: 3600 })
        console.log('token' + token)
        res.status(200).json({ success: true, token: token })
      }
      else {
        res.status(401).json({ success: false })
      }
    }


  })
})
// ********** mise a jour *********
router.put('/update/:id', function (req, res) {
  let query = { "_id": req.params.id }
  user.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, user) {
    if (err)
      return res.send(err)

    res.send('modifié avec succés!');
  });
})
//*******Supprimer *********
router.delete('/supprimer/:id', (req, res, next) => {
  let query = { "_id": req.params.id };
  user.remove(query, (err) => {
    if (err) {
      console.log(err);
      res.send("erreur lors de la supression !")
    } else {
      res.status(200).json({ success: true })
    }
  })
});


module.exports = router;
