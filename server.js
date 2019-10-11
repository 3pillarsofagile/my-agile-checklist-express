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

app.post('/userid/:id', (req, res) => {
    let all_practices = [];
    Practice.find()
    .then((data) => {
        all_practices = data;
        User.findById(req.params.id)
        .then((doc) => {
            res.json({practices: all_practices, user: doc, checklist: doc.checklist})
        })
        .catch(err => res.status(400).json('Error @ get user by id, ' + err));
    })
    .catch(err => res.status(400).json('Error @ get all practices, ' + err));
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
                slug : "epm",
                title: "Apakah pihak (atau pihak-pihak) yang berkuasa menentukan fitur-fitur apa saja yang akan dikembangkan*, rutin berkomunikasi langsung dengan tim pengembang?",
                description: "*) Selanjutnya disebut Product Manager.",
                if_yes_advice: "Bagus! Tingkatkan intensitas & kualitas pertemuan Product Manager dengan tim pengembang. Tingkatkan juga transparansi dari kedua-belah pihak, sedemikian sehingga 1) Product Manager makin menghargai estimasi lama waktu pengerjaan dari tim pengembang, dan 2) tim pengembang memahami alasan dibalik arahan fitur-fitur dari Product Manager.",
                if_no_advice: "Produk tidak akan bisa bergerak tangkas melayani pengguna jika mereka &mdash; yang memberikan pekerjaan & yang mengerjakan &mdash; tidak bertemu langsung. Kenapa? Karena <em>trust</em> tidak terbangun. Instruksi pekerjaan dari Product Manager jadi diiringi dengan ekspektasi lama pengerjaan yang sempit &mdash; karena takut tim pengembang tidak berkerja optimal. Tim pengembang sendiri kecewa karena seperti dipaksa lembur terus-terusan & karena tidak ada penjelasan atas permintaan-permintaan fitur yang aneh bin mendadak. Ini adalah fenomena wajar di Waterfall &mdash; tidak terlalu masalah karena rencana pekerjaan relatif bisa dikunci di awal. Di organisasi yang mengaku menggunakan bingkai kerja agile, fenomena ini disebut dengan istilah <em>proxy Product Manager</em>. 'Proxy' karena sosok Product Manager yang rutin berkomunikasi dengan tim pengembang tidak punya otonomi untuk menentukan fitur-fitur apa yang akan dibuat. Beliau harus terlebih dahulu meminta persetujuan atasan (baca: Product Manager yang sebenarnya tapi tidak mau terjun langsung)."
            }),
            new Practice({
                slug : "mvp",
                title: "Apakah menurut kamu, rilis pertama dari produk (atau fitur besar) sering kali sudah tidak bisa dipercepat lagi?",
                description: "Dengan kata lain, apakah menurut kamu, target-target rilis pertama, biasanya sudah paling kecil (biasa disebut MVP &mdash; minimum viable product)?",
                if_yes_advice: "Bagus! Pastikan rilis-rilis setelah MVP juga cepat & sering. Tingkatkan kualitas dengan mempelajari teknik-teknik riset pengguna. Sehingga selain cepat rilis, anda jadi juga tepat rilis (baca: peluang fitur yang dirilis disukai pengguna jadi makin tinggi).",
                if_no_advice: "Rilis pertama yang lambat meningkatkan resiko bangkrut-karena-membuat-fitur-yang-salah. Ini amat penting, apalagi di era kompetisi digital saat ini. Edukasi Product Manager & pimpinan-pimpinan terkait tentang pentingnya MVP."
            }),
            new Practice({
                slug : "for",
                title: "Setelah rilis yang pertama tersebut, apakah biasanya dilanjutkan dengan rilis-rilis yang cepat & sering?",
                description: "Umumnya lebih dari dua minggu sekali terhitung lambat. Meski industri tertentu punya standar berbeda.",
                if_yes_advice: "Bagus! Cepat rilis belum tentu tangkas, tapi lambat sudah pasti tidak tangkas. Tingkatkan dengan mempercepat lagi 'lead time' &mdash; yaitu waktu yang dihitung dari tersebutnya ide fitur (baik dari pengguna maupun dari internal), sampai ide tersebut jadi nyata & digunakan pengguna. Lead time adalah metrik yang lebih baik untuk mengukur kecepatan, karena juga menghitung lama proses pengambilan keputusan dan pematangan spesifikasi fitur.",
                if_no_advice: "Kompetisi bukanlah alasan utama harus rilis cepat & sering. Alasan utamanya adalah ukuran asumsi. Logikanya, makin lambat dan jarang rilis, makin besar asumsi saat rilis. Pekerjaan produksi software tidaklah sama dengan produksi pabrik. Setiap fitur baru adalah asumsi, sementara barang produksi pabrik bukan. Makin besar asumsi, makin besar peluang salahnya, dan bahkan makin sulit mencari penyebab kesalahan &mdash; karena varibel yang bermain jadi makin banyak. Jika kita segera memperkecil asumsi dan merilisnya  segera langsung ke pengguna (baca: memvalidasinya), kita akan segera diarahkan ke bentuk software yang paling membahagiakan pengguna dan menghasilkan uang buat kita."
            })
        ]).then((data) => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));;
    
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
