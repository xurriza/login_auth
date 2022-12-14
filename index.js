const app = require("./app.js").app;
// Conexión DB
require("./database/conn.js"); 
// App escuchando por puerto 3000
const port = app.get("port");
app.listen(port, () => console.log(`Servidor web escuchando por: http://localhost:${port}`));