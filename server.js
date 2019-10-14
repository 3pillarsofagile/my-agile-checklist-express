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
            res.json({
                practices: all_practices,
                user: doc,
                checklist: doc.checklist})
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
                slug : "fr",
                title : "Apakah rencana jangka panjang produk bisa berubah drastis akibat informasi baru dari pengguna (termasuk ide fitur dari internal yang sudah divalidasi pengguna",
                description: "",
                if_yes_advice: "",
                if_no_advice: ""
            }),
            new Practice({
                slug : "epm",
                title: "Apakah pihak (atau pihak-pihak) yang berkuasa menentukan fitur-fitur apa saja yang akan dikembangkan*, rutin berkomunikasi langsung dengan tim pengembang?",
                description: "Rutin di sini bisa di level harian jika diperlukan. *) Selanjutnya disebut Product Manager.",
                if_yes_advice: "Bagus! Tingkatkan intensitas & kualitas pertemuan Product Manager dengan tim pengembang. Tingkatkan juga transparansi dari kedua-belah pihak, sedemikian sehingga: <ol><li>Product Manager makin menghargai estimasi lama waktu pengerjaan dari tim pengembang</li><li>tim pengembang memahami alasan dibalik arahan fitur-fitur dari Product Manager</li></ol> <p>Cek praktik-praktik transparansi organisasi di <a href='https://3pillarsofagile.github.io/1-fast'>Pilar 1</a> & <a href='https://3pillarsofagile.github.io/2-flexible'>Pilar 2</a>, juga praktik <a href='https://3pillarsofagile.github.io/paper-prototyping'>Paper Prototyping</a>.</p>",
                if_no_advice: "<p>Produk tidak akan bisa bergerak tangkas melayani pengguna jika mereka &mdash; yang memberikan pekerjaan & yang mengerjakan &mdash; tidak bertemu langsung. Kenapa? Karena <em>trust</em> tidak terbangun.</p><p>Jika tidak ada <em>trust</em>, instruksi pekerjaan dari Product Manager jadi diiringi dengan ekspektasi lama pengerjaan yang sempit &mdash; karena takut tim pengembang banyak santai menunda pekerjaan. Tim pengembang sendiri kecewa karena seperti dipaksa lembur terus-terusan & karena tidak ada penjelasan atas permintaan-permintaan fitur yang aneh bin mendadak &mdash; fenomena yang cukup wajar di Waterfall karena rencana fitur dikunci di awal. Bagi proses kerja agile, yang rencana fiturnya bisa berubah drastis, jelas jadi masalah.</p> <p>Ini biasa disebabkan oleh fenomena <em>proxy Product Manager</em>. 'Proxy' karena sosok Product Manager yang rutin berkomunikasi dengan tim pengembang tidak punya otonomi untuk menentukan fitur-fitur apa yang akan dibuat. Beliau harus terlebih dahulu meminta persetujuan atasan &mdash; alias Product Manager yang sebenarnya tapi tidak mau terjun langsung ke pengguna dan tim pengambang.</p> <p>Akhir kata, solusinya jelas: pastikan ada Product Manager yang sebenarnya (baca: yang memimpin riset pengguna & punya otoritas untuk menentukan fitur-fitur serta deal-deal dengan pihak luar). Buat yang bersangkutan berkomunikasi langsung dengan tim pengembang secara intens.</p>"
            }),
            new Practice({
                slug : "mvp",
                title: "Apakah menurut kamu, target-target rilis pertama produk (atau sebuah fitur besar), sering kali sudah yang paling kecil ukurannya*?",
                description: "*) Biasa disebut MVP &mdash; minimum viable product",
                if_yes_advice: "<p>Bagus! Pastikan rilis-rilis setelah MVP juga cepat & sering. Tingkatkan kualitas dengan mempelajari teknik-teknik riset pengguna. Sehingga selain cepat rilis, anda jadi juga tepat rilis (baca: peluang merilis fitur yang disukai pengguna jadi makin tinggi).</p> <p>Cari teknik meriset pengguna di praktik-praktik kompetensi <a href='https://3pillarsofagile.github.io/1-fast'>Pilar 1</a> & <a href='https://3pillarsofagile.github.io/2-flexible'>Pilar 2</a>.</p>",
                if_no_advice: "<p>Rilis pertama yang lambat meningkatkan resiko bangkrut-karena-membuat-fitur-yang-salah. Ini amat penting, apalagi di era kompetisi digital saat ini. Edukasi Product Manager & pimpinan-pimpinan terkait tentang pentingnya MVP.</p> <p>Baca MVP & studi kasus orang lain terhadap di <a href='https://3pillarsofagile.github.io/mvp'>sini</a>.</p>"
            }),
            new Practice({
                slug : "for",
                title: "Setelah rilis yang pertama tersebut, apakah biasanya dilanjutkan dengan rilis-rilis yang cepat & sering?",
                description: "Umumnya lebih dari dua minggu sekali terhitung lambat. Meski industri tertentu punya standar berbeda.",
                if_yes_advice: "<p>Bagus! Cepat rilis belum tentu tangkas, tapi lambat sudah pasti tidak tangkas.</p> <p>Tingkatkan dengan mempercepat lagi 'lead time' &mdash; yaitu waktu yang dihitung dari tersebutnya ide fitur (baik dari pengguna maupun dari internal), sampai ide tersebut jadi nyata & digunakan pengguna. Lead time adalah metrik yang lebih baik untuk mengukur kecepatan, karena juga menghitung lama proses pengambilan keputusan dan pematangan spesifikasi fitur. Praktik seperti <a href='https://3pillarsofagile.github.io/paper-prototyping'>Paper Prototyping</a> & <a href='https://3pillarsofagile.github.io/automated-acceptance-testing'>Acceptance Testing yang otomatis</a> bisa meningkatkan lead time dari sisi ini.</p><p></p>",
                if_no_advice: "<p>Kompetisi bukanlah alasan utama harus rilis cepat & sering. Alasan utamanya adalah ukuran asumsi. Logikanya, makin lambat dan jarang rilis, makin besar asumsi saat rilis. Pekerjaan produksi software tidaklah sama dengan produksi pabrik. Setiap fitur baru adalah asumsi, sementara barang produksi pabrik bukan. Makin besar asumsi, makin besar peluang salahnya, dan bahkan makin sulit mencari penyebab kesalahan &mdash; karena varibel yang bermain jadi makin banyak. Jika kita segera memperkecil asumsi dan merilisnya  segera langsung ke pengguna (baca: memvalidasinya), kita akan segera diarahkan ke bentuk software yang paling membahagiakan pengguna dan menghasilkan uang buat kita."
            }),
            new Practice({
                slug : "ed",
                title : "Apakah Product Manager menyediakan data-data empirik (baik langsung dari pengguna maupun sumber lain) sebagai dasar alasan atas fitur baru yang dia minta?",
                description: "",
                if_yes_advice: "",
                if_no_advice: ""
            }),
            new Practice({
                slug : "rpm",
                title : "Apakah ada retro rutin terkait cara Product Manager (beserta timnya) dalam meriset pengguna?",
                description: "",
                if_yes_advice: "",
                if_no_advice: ""
            }),
            new Practice({
                slug : "td",
                title : "Apakah tim pengembang cukup transparan sehingga pihak lain (Product Manager, eksekutif, pemilik, dll) bisa menilai apakah tim pengembang memberikan etos kerja & waktu kerja yang sesuai gaji mereka?",
                description: "",
                if_yes_advice: "",
                if_no_advice: ""
            }),
            new Practice({
                slug : "rd",
                title : "Apakah  ada retro rutin terkait cara tim pengembang mengembangkan software?",
                description: "",
                if_yes_advice: "",
                if_no_advice: ""
            }),
            new Practice({
                slug : "enr",
                title : "Apakah tim pengembang dilobi untuk 'berkerja lebih cepat' / 'mengambil kerjaan lebih banyak' saat mengestimasi pekerjaan?",
                description: "",
                if_yes_advice: "",
                if_no_advice: ""
            }),
            new Practice({
                slug : "dod",
                title : "Apakah tim pengembang punya standar kualitas kerja tertentu, sehingga bug jadi minim dan kode mereka tetap terjaga untuk mudah dipahami?",
                description: "",
                if_yes_advice: "",
                if_no_advice: ""
            })
        ]).then((data) => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));;
    
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
