const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT =  process.env.PORT || 3000;
const HOST = '0.0.0.0';

const User = require("./models/user.model")

const result = dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
    app.get('/', (req, res) => {
        res.send('Koneksi ke DB sukses. ~ server My Agile Checklist');
    });
})

app.get('/api/user/:username/kode-rahasia/:password', function (req, res) {
    User.findOne({
        username: req.params.username,
        password: req.params.password
    }).exec(function (err, user){
        if (err) return handleError(err);
        // Prints "Space Ghost is a talk show host."
        console.log(user.checklist);
    })
});


app.post('/api/user/:username/kode-rahasia/:password', function (req, res) {
    user1 = new User({
        username: req.params.username,
        password: req.params.password,
        checklist: []
    })
    user1.save(function(error) {
        console.log("new user has registered");
        if (error) {
            console.error(error);
        }
    });
    /*
    res.json({
        status: "ets",
        message: 'Welcome to RESTHub crafted with love!',
        tes: "cuk"
    });*/
});

app.post('/api/practice-update/:username/kode-rahasia/:password', function (req, res) {

    User.findOne({
        username: req.params.username,
        password: req.params.password
    }).exec(function (err, user){
        if (err) return handleError(err);
        user.checklist = [4, 5, 6, [1 , 2]];
        user.save(function(error) {
            console.log("the user has been updated");
            if (error) {
                console.error(error);
            }
        });
        console.log(user);
    })

/*
    User.update({
        username: req.params.username,
        password: req.params.password
    }, {
        $set: { checklist: [4, 5, 6, [1 , 2]] }
    }, {
        upsert: true
    }, function (err, user){
        if (err) return handleError(err);
        console.log("changed")
    })
     User.findOne({
        username: req.params.username,
        password: req.params.password
    }).exec(function (err, user){
        if (err) return handleError(err);
        // Prints "Space Ghost is a talk show host."
        user.updateOne({
            checklist: [4, 5, 6, [1 , 2]]
        })
        console.log(user.checklist);
        user.save();
        console.log(user.checklist);
    }) */
        
});
    

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
