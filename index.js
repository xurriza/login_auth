const express = require('express');
const bodyParser = require('body-parser');

// Creamos la app de express
const app = express();

// Configuracion del puerto del servidor
const port = process.env.PORT || 5000;

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Parse requests of content-type - application/json
app.use(bodyParser.json())

// Definimos una ruta inicial (a http://localhost:5000/)
app.get('/', (req, res) => {
    res.send("Hello World");
});

// Escuchamos al servidor
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});