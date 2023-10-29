const express = require ('express')
const app = express()
const cors = require('cors')
const pool = require ('./controller/db_config')
const moment = require ('moment')
let currentDate = moment().format('YYYY-MM-DD, hh:mm:ss');

// import moment from 'moment';


app.use(cors())
app.use(express.json())

port = 7000

app.get('/', (req, res) => {
    // res.send('Hello World!');
    console.log(currentDate)
    res.sendFile('./index.html', {root:__dirname})
  });



  
// open list semua kontakn
app.get('/kontakPesan', (req, res) => {
    pool.query('SELECT * FROM kontak_pesan', (error, results, fields) => {
        if (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});


// untuk menampilkan form pesan kontak
app.get('/insertPesanKontak', (req, res) => {
    
  
    res.sendFile('./insertPesan.html', {root:__dirname})
  });

// insert pesan untuk proses formnya
app.post('/insertPesanKontak', (req, res) => {
    const { nama, email, alamat, pesan, no_kontak } = req.body;

    // Pastikan bahwa nilai yang diterima sesuai dengan kolom-kolom tabel pesan_kontak
    const sql = `INSERT INTO kontak_pesan (id, nama, email, alamat, pesan, no_kontak, createdAt, updatedAt) 
                 VALUES ( '','${nama}','${email}',  '${alamat}', '${pesan}', '${no_kontak}','${currentDate}','${currentDate}')`;

    pool.query(sql, [nama, email, alamat, pesan, no_kontak], (error, results, fields) => {
        if (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ message: 'Data inserted successfully' });
        }
    });
});

app.listen(port, () => {
  
    console.log(`Example app listening on port http://localhost:${port}/`)
  })