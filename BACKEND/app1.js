// https://github.com/dedeanjarpermana/wgsBootcamp_Dede.Anjar


const express = require ('express')
const app = express()
const cors = require('cors')
// const pool = require ('./config_database')
const { hash } = require('bcryptjs')
const morgan = require('morgan') // morgan
const passport = require('passport')
// const initializePassport = require('./passportConfig')
// initializePassport(passport)
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
// const Writable = require("stream").Writable
// morgan.token("custom", "-method: :method -endpoint: :url -status: status")
app.use(cors())
app.use(express.json())

const logger = require('express-log-psql'); // morgan to postgress
const { response } = require('express')
// const { session } = require('passport')


port = 7000

// app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(
//   session({
//     key:"username",
//     secret:"dap",
//     resave:false,
//     saveUnitialized:false,
//     cookie:{
//       expires:60* 60*24,
//     },
//   })
// )
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) // morgan to file
// app.use(morgan('combined', { stream: accessLogStream }))

// proses login user
app.post("/login",
  passport.authenticate("local", {
    
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);


app.get("/login", (req, res) => {
  if(req.session.user) {
    res.send({loggedIn:true, user:req.session.user});
  } else {
    res.send({loggedIn:false})
  }
})

app.get('/total', async(req, res) => {
  try {
      const {rows : sumbarang} = await pool.query(`SELECT SUM(jumlah_barang)
      FROM tb_barang`)
      res.json(sumbarang)
  } catch (error) {
      console.error(err.message)
  }
})

// app.get("/total", (req, res) => {
//   if(req.session.user) {
//     res.send({loggedIn:true, user:req.session.user});
//   } else {
//     res.send({loggedIn:false})
//   }
// })


app.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  pool.query(`select from tb_user where email = '${email}'`,
  email,
  (err, result) => {
    if(err) {
      res.send({err:err});
    }

    if (result.length >0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          req.session.user = result;
        }
      })
    }
  }

  )
})
// open list semua kontak
app.get('/contacts', async(req, res) => {
  try {
      const {rows : allContacts} = await pool.query(`SELECT * FROM tb_user`)
      res.json(allContacts)
  } catch (error) {
      console.error(err.message)
  }
})


// insert contact  -- user
app.post('/add_contacts', async (req, res) => {
  try {
      
      const {username, name, email,  password, role, mobile} = req.body
      // console.log(username, name, email,  password, role, mobile)

      const hashedPassword = await hash(password, 10)
      const {rows : newContacts} = await pool.query(`INSERT INTO tb_user (username, name, email, password, role, mobile) VALUES ('${username}','${name}','${email}','${hashedPassword}','${role}','${mobile}') RETURNING *`)
      res.json(newContacts)
  } catch (error) {
      console.error(error.message)
  }
})

// Get Contact users  by ID
app.get('/contacts/:username', async (req, res) => {
  try {
      const {username} = req.params
      const {rows : users} = await pool.query(`SELECT * FROM tb_user WHERE username = $1`, [username])
      res.json(users)
  } catch (error) {
      console.error(err.message)
  }
})

// Update users
app.put('/contacts/:username', async (req, res) => {
  try {
      
      const { updatename, updateemail, updatepassword, updatemobile, updaterole } = req.body
      const updateContact = await pool.query(`UPDATE tb_user SET name = '${updatename}', email = '${updateemail}', password = '${updatepassword}', role = '${updaterole}', mobile = '${updatemobile}' WHERE username = '${req.params.username}'`)
      res.json("Contact succesfully  Updated")
  } catch (error) {
      console.error(err.messages)
  }
})

// Delete users
app.delete('/contacts/:username', async(req, res) => {
  try {
      const { username } = req.params
      const deleteContact = await pool.query(`DELETE FROM tb_user WHERE username = $1`, [username])
      res.json('Contact succesfully  deleted')
  } catch (error) {
      console.error(error.message)
  }
})

// open list barang
app.get('/list_barang', async(req, res) => {
  try {
      const {rows : allBarang} = await pool.query(`SELECT * FROM tb_barang`)
      res.json(allBarang)
  } catch (error) {
      console.error(err.message)
  }
})

// ngambil data dari query
app.get('/list_barang', async(req, res) => {
  try {
      const {rows : sumBarangQuery} = await pool.query(` SELECT SUM(jumlah_barang) FROM tb_barang`)
      res.json(sumBarangQuery)
  } catch (error) {
      console.error(err.message)
  }
})

// insert barang
app.post('/list_barang', async (req, res) => {
  try {
      
      const {id_barang, nama_barang, jumlah_barang,  harga_barang, photo, id_penginput} = req.body
      // console.log(id_barang, nama_barang, jumlah_barang,  harga_barang, photo, id_penginput)
      
      const {rows : newBarangs} = await pool.query(`INSERT INTO public.tb_barang (id_barang, nama_barang, jumlah_barang, harga_barang, photo, id_penginput) 
        VALUES ('${id_barang}','${nama_barang}','${jumlah_barang}','${harga_barang}','${photo}','${id_penginput}') RETURNING *`)
      res.json(newBarangs)
  } catch (error) {
      console.error(error.message)
  }
})


// Delete barang
app.delete('/list_barang/:id_barang', async(req, res) => {
  try {
      const { id_barang } = req.params
      const deleteBarang = await pool.query(`DELETE FROM tb_barang WHERE id_barang = $1`, [id_barang])
      res.json('Contact succesfully  deleted')
  } catch (error) {
      console.error(error.message)
  }
})


// Get barang  by ID
app.get('/list_barang/:id_barang', async (req, res) => {
  try {
      const {id_barang} = req.params
      const {rows : barangs} = await pool.query(`SELECT * FROM tb_barang WHERE id_barang = $1`, [id_barang])
      res.json(barangs)
  } catch (error) {
      console.error(err.message)
  }
})

// Update barang
app.put('/list_barang/:id_barang', async (req, res) => {
  try {
      
      const { updateNamaBarang, updateJumlahBarang, updateHargaBarang, updateIdPenginput} = req.body
      const updateBarang = await pool.query(`UPDATE tb_barang SET nama_barang = '${updateNamaBarang}', jumlah_barang = '${updateJumlahBarang}', harga_barang = '${updateHargaBarang}', id_penginput = '${updateIdPenginput}' WHERE id_barang = '${req.params.id_barang}'`)
      res.json("Contact succesfully  Updated")
  } catch (error) {
      console.error(err.messages)
  }
})


app.listen(port, () => {
  
    console.log(`Example app listening on port http://localhost:${port}/`)
  })