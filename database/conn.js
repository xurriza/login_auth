const mysql = require('mysql');
// para leer variables de entorno (archivo .env)
const dotenv = require ("dotenv")
dotenv.config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

conn.connect( error => {
    if (error) throw error; // Excepcion de error por consola
    console.log("Conexion a la base de datos ok!");
});

exports.conn = conn;