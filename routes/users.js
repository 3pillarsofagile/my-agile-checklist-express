const express = require('express');
const app = express();
const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');

app.use(express.json());

router.route('/register').post((req, res) => {
    
    if(!req.body.username.match(/([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g)){
        res.status(400).json('Error: alamat email bukan gmail.')
        return;
    }

    User.findOne( // find the user with the credentials 
    {
        username: req.body.username
    })
        .then(doc => {
            if(doc){     // if exist, return it
                res.status(400).json('Error: username sudah ada')
            }else{       // if doesn't exist, create it

                bcrypt.hash(req.body.secretcode, 10, function(err, hash) {
                    const newUser = new User({
                        username: req.body.username,
                        secretcode: hash,
                        checklist: []
                    });
                
                    newUser.save()
                        .then((data) => res.json(data))
                        .catch(err => res.status(400).json('Error: ' + err));
                });

            }
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
});

router.route('/login').post((req, res) => {

    User.findOne( // find the user with the credentials 
    {
        username: req.body.username
    })
        .then(doc => {
            if(doc){     // if exist, return it
                bcrypt.compare(req.body.secretcode, doc.secretcode, function(err, bcrypt_res) {
                    if(bcrypt_res) {
                     // Passwords match
                     res.json(doc)
                    } else {
                        res.status(400).json('Error: password tidak cocok')
                    } 
                  });
            }else{       // if doesn't exist, create it

            res.status(400).json('Error: username '+req.body.username+' tidak ada')

            }
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
        
});

router.route('/checklist-update').post((req, res) => {

    
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
            res.json(doc)
        })
        .catch(err => {
            res.json(err)
        })
   
});

module.exports = router;