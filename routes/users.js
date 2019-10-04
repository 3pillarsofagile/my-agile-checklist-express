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

router.route('/enter').post((req, res) => {

    User.findOne( // find the user with the credentials 
    {
        username: req.body.username,
        secretcode: req.body.secretcode
    })
        .then(doc => {
            if(doc)     // if exist, return it
                res.json(doc)
            else{       // if doesn't exist, create it
                const newUser = new User({
                    username: req.body.username,
                    secretcode: req.body.secretcode,
                    checklist: []
                });
            
                newUser.save()
                    .then((data) => res.json(data))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
        
});

router.route('/checklist-update').post((req, res) => {

    console.log(req.body);
    /*
    User.findOneAndUpdate(
    {
        username: req.body.user.username,
        secretcode: req.body.user.secretcode
    }, 
    {
        checklist: req.body.checklist
    },
    {
        new: true,              // return updated doc
        runValidators: true     // validate before update
    })
        .then(doc => {
            console.log(doc)
        })
        .catch(err => {
            console.error(err)
        })
   */     
});

module.exports = router;