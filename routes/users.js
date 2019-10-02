const express = require('express');
const app = express();
const router = require('express').Router();
let User = require('../models/user.model');

app.use(express.json());

router.route('/').get((req, res) => {
    
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/add').post((req, res) => {

  const newUser = new User({
        username: req.body.username,
        secretcode: req.body.secretcode,
        checklist: req.body.checklist
    });
  
    console.log(newUser);
  
  newUser.save()
    .then(() => res.json('User '+req.body.username+' added!'))
    .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;