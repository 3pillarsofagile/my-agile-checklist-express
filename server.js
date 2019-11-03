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

app.post('/api', (req, res) => {
    res.json("success")
  });

app.post('/userid/:id', (req, res) => {
    let all_practices = [];
    Practice.find()
    .sort( { order: 1 } )
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
        let i = 0;
        Practice.create([ 
            new Practice({
                order: ++i,
                slug : "fr",
                title : "Apakah rencana jangka panjang produk bisa langsung direvisi secara drastis, ketika muncul informasi baru dari pengguna?",
                description: "Pengguna berarti semua pihak yang menikmati produk. Jika produk Z adalah API yang digunakan tim pengembang A untuk mengembangkan produk X, maka tim pengembang A serta pengguna produk X adalah pengguna produk Z.",
                if_yes_advice: "Bagus! Produk juara adalah produk yang paling tangkas membahagiakan penggunanya. Ini adalah esensi utama dari ketangkasan. Jika sudah ada data valid dari pengguna, bahwa yang akan dikerjakan bulan depan bukanlah yang paling dibutuhkan mereka, maka menunda perubahan hanya mengurangi ketangkasan produk.",
                if_no_advice: "Coba analisa akar penyebab perubahan. Biasanya regulasi atau resistensi beberapa pihak. Cara yang paling mudah adalah mengumpulkan data empirik dari pengguna, lalu membawanya ke depan pimpinan yang paling peduli terhadap kesuksesan produk. Jika pihak itu tidak ada, sudah saatnya Anda mencari tempat baru."
            }),
            new Practice({
                order: ++i,
                slug : "epm",
                title: "Apakah pihak (atau pihak-pihak) yang berkuasa menentukan fitur-fitur apa saja yang akan dikembangkan*, rutin berkomunikasi langsung dengan tim pengembang?",
                description: "Rutin di sini bisa di level harian jika diperlukan. *) Selanjutnya disebut Product Manager.",
                if_yes_advice: "Bagus! Tingkatkan intensitas & kualitas pertemuan Product Manager dengan tim pengembang. Tingkatkan juga transparansi dari kedua-belah pihak, sedemikian sehingga: <ol><li>Product Manager makin menghargai estimasi lama waktu pengerjaan dari tim pengembang</li><li>Tim pengembang memahami alasan di balik arahan fitur-fitur dari Product Manager</li></ol> <p>Cek praktik-praktik transparansi organisasi di <a href='https://3pillarsofagile.github.io/1-fast'>Pilar 1</a> & <a href='https://3pillarsofagile.github.io/2-flexible'>Pilar 2</a>, juga praktik <a href='https://3pillarsofagile.github.io/paper-prototyping'>Paper Prototyping</a>.</p>",
                if_no_advice: "<p>Produk tidak akan bisa bergerak tangkas melayani pengguna jika mereka &mdash; yang memberikan pekerjaan & yang mengerjakan &mdash; tidak bertemu langsung. Kenapa? Karena <em>trust</em> tidak terbangun.</p><p>Jika tidak ada <em>trust</em>, instruksi pekerjaan dari Product Manager jadi diiringi dengan ekspektasi lama pengerjaan yang sempit &mdash; karena takut tim pengembang banyak santai menunda pekerjaan. Tim pengembang sendiri kecewa karena seperti dipaksa lembur terus-terusan & karena tidak ada penjelasan atas permintaan-permintaan fitur yang aneh bin mendadak. Fenomena ini cukup wajar di Waterfall &mdash; karena rencana fitur dikunci di awal. Namun Bbagi proses kerja agile, yang rencana fiturnya bisa berubah drastis, jelas jadi masalah.</p> <p>Ini biasa disebabkan oleh fenomena <em>proxy Product Manager</em>. 'Proxy' karena sosok Product Manager yang rutin berkomunikasi dengan tim pengembang tidak punya otonomi untuk menentukan fitur-fitur apa yang akan dibuat. Beliau harus terlebih dahulu meminta persetujuan atasan &mdash; alias Product Manager yang sebenarnya tapi tidak bisa terjun langsung ke pengguna dan tim pengambang.</p> <p>Akhir kata, solusinya jelas: pastikan ada Product Manager yang sebenarnya (baca: yang memimpin riset pengguna & punya otoritas untuk menentukan fitur-fitur serta deal-deal dengan pihak luar). Buat yang bersangkutan berkomunikasi langsung dengan tim pengembang secara intens.</p>"
            }),
            new Practice({
                order: ++i,
                slug : "mvp",
                title: "Apakah menurut kamu, target-target rilis pertama produk (atau sebuah fitur besar), sering kali sudah yang paling kecil ukurannya*?",
                description: "*) Biasa disebut MVP &mdash; minimum viable product",
                if_yes_advice: "<p>Bagus! Pastikan rilis-rilis setelah MVP juga cepat & sering. Tingkatkan kualitas dengan mempelajari teknik-teknik riset pengguna. Sehingga selain cepat rilis, anda jadi juga tepat rilis (baca: peluang merilis fitur yang disukai pengguna jadi makin tinggi).</p> <p>Cari teknik meriset pengguna di praktik-praktik kompetensi <a href='https://3pillarsofagile.github.io/1-fast'>Pilar 1</a> & <a href='https://3pillarsofagile.github.io/2-flexible'>Pilar 2</a>.</p>",
                if_no_advice: "<p>Rilis pertama yang lambat meningkatkan resiko bangkrut-karena-membuat-fitur-yang-salah. Ini amat penting, apalagi di era kompetisi digital saat ini. Edukasi Product Manager & pimpinan-pimpinan terkait tentang pentingnya MVP.</p> <p>Baca MVP & studi kasus orang lain terhadap di <a href='https://3pillarsofagile.github.io/mvp'>sini</a>.</p>"
            }),
            new Practice({
                order: ++i,
                slug : "for",
                title: "Setelah rilis yang pertama tersebut, apakah biasanya dilanjutkan dengan rilis-rilis yang cepat & sering?",
                description: "Umumnya lebih dari dua minggu sekali terhitung lambat. Meski industri tertentu punya standar berbeda.",
                if_yes_advice: "<p>Bagus! Cepat rilis belum tentu tangkas, tapi lambat sudah pasti tidak tangkas.</p> <p>Tingkatkan dengan mempercepat lagi 'lead time' &mdash; yaitu waktu yang dihitung dari tersebutnya ide fitur (baik dari pengguna maupun dari internal), sampai ide itu jadi nyata & digunakan pengguna. Lead time adalah metrik yang lebih baik untuk mengukur kecepatan, karena juga menghitung lama proses pengambilan keputusan dan pematangan spesifikasi fitur. Praktik seperti <a href='https://3pillarsofagile.github.io/paper-prototyping'>Paper Prototyping</a> & <a href='https://3pillarsofagile.github.io/automated-acceptance-testing'>Acceptance Testing yang otomatis</a> bisa meningkatkan lead time dari sisi ini.</p><p></p>",
                if_no_advice: "<p>Kompetisi bukanlah alasan utama harus rilis cepat & sering. Alasan utamanya adalah ukuran asumsi. Logikanya, makin lambat dan jarang rilis, makin besar asumsi saat rilis. Pekerjaan produksi software tidaklah sama dengan produksi pabrik. Setiap fitur baru adalah asumsi, sementara barang produksi pabrik bukan. Makin besar asumsi, makin besar peluang salahnya, dan bahkan makin sulit mencari penyebab kesalahan &mdash; karena varibel yang bermain jadi makin banyak. Jika kita segera memperkecil asumsi dan merilisnya  segera langsung ke pengguna (baca: memvalidasinya), kita akan segera diarahkan ke bentuk software yang paling membahagiakan pengguna dan menghasilkan uang buat kita."
            }),
            new Practice({
                order: ++i,
                slug : "ed",
                title : "Apakah Product Manager menyediakan data-data empirik sebagai dasar alasan atas fitur baru yang dia minta?",
                description: "Data empirik bisa disebut sebagai 'bukti nyata'. Asalnya bisa dari pengguna, calon pengguna, ataupun dari hasil penelitian ilmiah.",
                if_yes_advice: "Bagus! Tingkatkan terus kualitas eksekusi riset.",
                if_no_advice: "<p>Edukasi Product Manager bahwa mengembangkan software pada hakikatnya adalah kegiatan eksplorasi alias R&D alias eksperimen. Berbeda dengan proyek membangun rumah, jembatan, atau penyelenggaraan pesta pernikahan, pengembangan software penuh ketidakpastian. Untuk itu, data empirik akan memudahkan siapa saja memahami kenapa pekerjaan saat ini adalah yang paling bermanfaat untuk pengguna.</p> <p>Ingat, tim pengembang adalah manusia, bukan komputer yang tidak peduli pada alasan di balik perintah kerja yang mereka terima.</p>"
            }),
            new Practice({
                order: ++i,
                slug : "mkr",
                title : "Apakah jarang terjadi miskomunikasi terkait spesifikasi fitur antara Product Manager (atau timnya) dengan tim pengembang?",
                description: "",
                if_yes_advice: "Bagus! Lanjutkan.",
                if_no_advice: "<p>Tidak ada pakem yang universal tentang bagaimana mengkomunikasikan permintaan fitur. Ada tim yang nyaman dengan deskripsi yang tidak detail, ada yang justru perlu sangat detail.</p> <p>Jadi, solusinya adalah kuasai banyak teknik menulis spesifikasi, banyak <em>trial-error</em> dan tingkatkan komunikasi PM dengan tim pengembang selama <em>trial-error</em>. Baca <a href='https://3pillarsofagile.github.io/1-fast'>praktik-praktik di Pilar 1</a> untuk mencari inspirasi. </p>"
            }),
            new Practice({
                order: ++i,
                slug : "pmt",
                title : "Apakah Product Manager dan tim beliau cukup transparan dalam berkerja (termasuk apakah antrian fitur-nya bisa dilihat siapapun)?",
                description: "<p>Antrian fitur di sini artinya belum (atau sedang) dikerjakan oleh tim pengembang. Lebih lanjutnya di <a href='https://3pillarsofagile.github.io/transparent-work-backlog'>Backlog</a>.</p>",
                if_yes_advice: "Bagus! Pertahankan.",
                if_no_advice: "<p>Edukasi Product Manager dan timnya, bahwa peran mereka sangat krusial sampai perlu transparan. Semua permintaan fitur dari pelbagai pihak bermuara ke mereka. Tidak jarang, Product Manager harus menolak permintaan pengerjaan fitur. Transparansi cara kerja mereka akan membantu pihak yang ditolak untuk menerima alasan penolakan.</p><p>Jika tidak transparan, pihak-pihak luar bisa curiga kalau Product Manager hanya subyektif dalam menentukan fitur-fitur mana saja yang akan dikerjakan tim pengembang.</p>"
            }),
            new Practice({
                order: ++i,
                slug : "rpm",
                title : "Apakah ada retro rutin terkait cara Product Manager (beserta timnya) dalam meriset pengguna?",
                description: "Retro adalah kegiatan rutin & singkat untuk mengangkat masalah tim & membahas aksi perbaikan. Lebih detail di <a href='https://3pillarsofagile.github.io/team-retrospective'>Retrospektif Tim</a>.",
                if_yes_advice: "Bagus! Meski bukan eksekutor, tim pengembang juga bagus untuk ikut di retro ini &mdash; atau minimal melihat survei retro & aksi perbaikan yang disepakati. Tim pengembang jadi lebih bersemangat berkerja, karena paham kerja keras pihak yang memberikan mereka pekerjaan.",
                if_no_advice: "Sering bagikan informasi berikut ke Product Manager:</p><ol><li>Komplain-komplain dari internal/eksternal terkait kualitas produk.</li><li>Inovasi-inovasi terbaru di dunia riset pengguna (<a href='https://3pillarsofagile.github.io/2-flexible'>Pilar 2 - Tiga Pilar Agile</a> atau semacam <a href='https://www.uxbooth.com/categories/design-research/'>UX Booth</a>)</li></ol><p>Sehingga beliau merasa butuh untuk memperbaiki cara kerja dia dan tim secara rutin.</p>"
            }),
            new Practice({
                order: ++i,
                slug : "td",
                title : "Apakah tim pengembang berkerja dengan cukup transparan, sehingga pihak lain jadi segera dapat notifikasi saat estimasi tim pengembang akan meleset & jadi bisa menilai apakah tim pengembang memberikan etos serta waktu kerja yang sesuai gaji mereka?",
                description: "Pihak lain di sini merujuk ke Product Manager, eksekutif, pemilik, dan siapapun di luar tim pengembang.",
                if_yes_advice: "Bagus! Lanjutkan. Ini ada hubungan dengan estimasi yang makin akurat. Baca poin di bawah. ",
                if_no_advice: "<p>Tidak seperti pembangunan rumah, pekerjaan pembangunan software tidak bisa dilihat oleh orang awam. Oleh karena itu, sulit untuk berempati terhadap kesulitan-kesulitan yang mereka alami.</p><p>Meski begitu, bukan berarti tidak bisa dimaksimalkan transparansinya. Baca praktik-praktik berikut <a href='https://3pillarsofagile.github.io/sprint'>Sprint</a>, <a href='https://3pillarsofagile.github.io/kanban-board-for-a-project'>Papan Kanban</a>, atau<a href='https://3pillarsofagile.github.io/checklist-on-quality'>Checklist Kualitas</a>.</p>"
            }),
            new Practice({
                order: ++i,
                slug : "enr",
                title : "Apakah tim pengembang tidak dilobi untuk 'berkerja lebih cepat' / 'mengambil kerjaan lebih banyak', sehingga estimasi mereka jadi terus makin akurat?",
                description: "",
                if_yes_advice: "Bagus! Lanjutkan.",
                if_no_advice: "<p>Logikanya sederhana: jika estimasi dari tim pengembang tidak dihargai, mereka jadi malas untuk jujur memberikan estimasi. Percuma saja, karena toh tidak akan didengar. Jika mereka tidak jujur memberikan estimasi, mereka tidak akan dapat kesempatan untuk melatih akurasi estimasi mereka, lewat memahami kapasitas mereka yang sebenarnya.</p> <p>Pihak bisnis (Product Manager) butuh estimasi yang akurat, dan itu wajar sekali. Estimasi yang akurat akan memudahkan mereka mengatur strategi dan membuat janji-janji dengan pihak luar. Jika ingin estimasi yang akurat, hargai estimasi tim pengembang dengan tidak melobi estimasi mereka. Jika memang ada peluang bisnis yang bernilai, sehingga harus menyelesaikan sekian fitur sebelum waktu tertentu, jelaskanlah ke tim pengembang. Duduk bersama mereka untuk mencari solusinya. Memaksa mereka berkerja lembur secara sepihak akan membuat mereka sulit jujur mengestimasi di masa depan.</p> <p>Untuk mudah menghargai estimasi tim pengembang, diperlukan rasa percaya bahwa mereka telah berkerja maksimal sepanjang jam kerja. Di sinilah pentingnya tranparansi di poin sebelumnya.</p>"
            }),
            new Practice({
                order: ++i,
                slug : "dod",
                title : "Apakah tim pengembang punya standar minimum tertentu dalam berkerja (SOP) yang harus ditaati dalam kondisi apapun, sehingga <em>bug</em> jadi minim dan kode mereka tetap terjaga untuk mudah dipahami?",
                description: "",
                if_yes_advice: "Bagus! Jangan pernah berhenti untuk memperbaiki SOP. Karena kecepatan dan kemudahan pengembangan di masa depan akan dipertaruhkan. Baca <a href='https://3pillarsofagile.github.io/1-fast'>praktik-praktik di Pilar 1</a> untuk mencari inspirasi.",
                if_no_advice: "<p>SOP diciptakan justru karena pekerjaan bisa 'beres' tanpa SOP &mdash; beres namun tidak berkualitas. Amat mudah untuk lalai menegakkan kualitas di kerja tim. Apalagi jika pekerjaannya bertipe individualistis seperti pemograman. Melalaikan kualitas kode berarti memperlambat atau bahkan membuntukan pekerjaan di masa depan. Adanya SOP yang transparan akan membantu tim agar tidak lalai.</p> <p>Contoh nyata & tips agar mudah transparan bisa dibaca di <a href='https://3pillarsofagile.github.io/checklist-on-quality'>Checklist untuk Kualitas</a>.</p>"
            }),
            new Practice({
                order: ++i,
                slug : "rd",
                title : "Apakah ada retro rutin terkait cara tim pengembang mengembangkan software?",
                description: "",
                if_yes_advice: "Bagus! Lanjutkan.",
                if_no_advice: "Pengembangan software adalah kegiatan yang amat kompleks. Dibanding pengembangan bangunan rumah, lama pengerjaannya jauh lebih sulit diestimasi. Banyak variabel yang harus diperhatikan. Kesenjangan keahlian & pengalaman para pekerja sering kali amat lebar. Sementara teknik-teknik yang lebih bagus dan baru selalu muncul. Maka, penting sekali untuk memperbaiki teknik berkerja secara rutin."
            }),
            new Practice({
                order: ++i,
                slug : "idt",
                title : "Apakah tim pengembang diberi ruang untuk meningkatkan standar kualitas pekerjaan (SOP) mereka?",
                description: "",
                if_yes_advice: "Bagus! Pastikan SOP mereka transparan, sehingga mereka bisa segera dihubungi jika ada yang dirasa kurang pas oleh pihak lain. Di luar itu, terus berikan mereka otonomi untuk langsung menambah/mengurangi SOP &mdash; di luar bagian yang diwajibkan organisasi tentu saja.",
                if_no_advice: "Sederhana saja, retro akan sia-sia jika mereka tidak bisa memperbarui SOP mereka sendiri."
            })

        ]).then((data) => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));;
    
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
