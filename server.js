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

const usersRouter = require('./routes/users');

app.use('/api/users', usersRouter);

app.post('/api/practice-update/:username/kode-rahasia/:password', function (req, res) {

    User.findOneAndUpdate(
    {
        username: req.params.username,
        password: req.params.password
    }, 
    {
        checklist: [8, 9, 6, [1 , 2]]
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
        
});
    
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
