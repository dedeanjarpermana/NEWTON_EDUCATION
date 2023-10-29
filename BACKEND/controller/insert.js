const db = require("./db_config");


db.connect(function(err) {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }
  
    console.log('Connected to database with threadId: ' + db.threadId);
  });

const sql = `INSERT INTO kontak_pesan (name, email, alamat, pesan, no_kontak) 
            VALUES ('zahira', 'zahira@yahoo.com','Lombok Epicentrum Mall', 'jadilah manusia berguna', '0291020202020')`;

db.query(sql, function (err, result) {
  if (err) throw err;
  console.log("1 record inserted");
});