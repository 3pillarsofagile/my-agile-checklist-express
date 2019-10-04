const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT =  process.env.PORT || 3000;
const HOST = '0.0.0.0';

let Practice = require('./models/practice.model');

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

app.get('/userid/:id', (req, res) => {
    let all_practices = [];
    Practice.find()
        .then((data) => { all_practices = data; })
        .catch(err => res.status(400).json('Error @ get all practices, ' + err));
    
    User.findById(req.params.id)
        .then((doc) => {
            res.json({practices: all_practices, user: doc, user_checklist: doc.user_checklist})
        })
        .catch(err => res.status(400).json('Error @ get user by id, ' + err));
});

app.get('/api/practices', (req, res) => {
    Practice.find()
        .then((data) => {res.json(data)})
        .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/populate-practices', (req, res) => {

    Practice.deleteMany({}) // kosongkan semua data
        .then(() => {       // lalu isi dengan data berikut
            Practice.create([ 
                new Practice({
                    slug : "clear-decision-making",
                    title: "Apakah proses pengambilan keputusan tentang fitur-fitur yang akan dibuat, sudah cukup ringkas dan jelas?",
                    description: "",
                    if_yes_advice: "Bagus! Pertahankan. Karena jika dari awalnya saja bertele-tele & tidak jelas, tentu menunjukkan rendahnya kualitas arahan produk atau lambatnya inisaitif muncul.",
                    if_no_advice: "Ada banyak cara untuk memperbaiki ini. Mungkin bisa dimulai dengan menunjuk satu orang sebagai pemimpin produk & membuat komunikasi beliau intens terhadap semua pihak di produk."
                }),
                new Practice({
                    slug : "mvp",
                    title: "Apakah menurut kamu, rilis pertama dari produk (atau fitur besar) seringkali masih bisa dipercepat?",
                    description: "Dengan kata lain, apakah target rilis pertamanya menurut kamu terlalu muluk/besar?",
                    if_yes_advice: "Rilis yang lambat meningkatkan resiko bangkrut-karena-membuat-fitur-yang-salah. Ini amat penting, apalagi di era kompetisi digital saat ini. Edukasi pihak(-pihak) penentu fitur tentang pentingnya MVP",
                    if_no_advice: "Bagus! Pertahankan. Tingkatkan dengan mempelajari teknik-teknik riset pengguna. Sehingga selain cepat rilis, anda jadi juga tepat rilis (baca: peluang fitur yang dirilis disukai pengguna jadi makin tinggi)."
                })
            ]).then((data) => res.json(data))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));;
     
});
    
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
