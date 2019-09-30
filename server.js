const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT =  process.env.PORT || 3000;
const HOST = '0.0.0.0';

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

app.get('/api', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
