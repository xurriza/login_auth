// IMPORTS
// importamos el paquete express de "node_modules"
const Express = require("express");
const session = require("express-session");
const viewsRoutes = require("./routes/view.routes.js").router;
const userRoutes = require("./routes/user.routes.js").router;
// INICIALIZACIONES
// creamos un objeto de la clase Express
const app = new Express();



// CONFIGURACIONES
app.set("port", 5000);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
// MIDDLEWARE
// sesiones
// app.use(session({
//     secret: "id{Dhp%zFj|Pt|p", // clave secreta para encriptacion del valor de la cookie
//     resave: false, // no se regenera la session id 
//     saveUninitialized: true, // Importante en valor TRUE cuando se desplega la app en un servidor remoto ej. Heroku
//     cookie: { secure: false }, // true para servidores con certificado ssl (https)
// }));


// Para tratamiento de datos JSON
app.use(Express.json());
// Establecer la carpeta de archivos estáticos: /public
// __dirname: devuelve la ruta del proyecto
app.use(Express.static(__dirname + "/public"));
// RUTAS
app.use(viewsRoutes, userRoutes);
app.use((req, res) => {
  //  res.status(404).render("404", {
   //     session: req.session.idUser
   // });
});

// app.get("/", (req, res) =>{
//     res.send("<h1>Hello future!</h1>");
// });
// app.post("/", (req,res) =>{
//     const datos = req.body;
//     console.log(datos);
//     res.send("Petición por POST ok: " + JSON.stringify(datos));
// });

exports.app = app;
