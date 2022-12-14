const Router = require("express");
const router = new Router();
const conn = require("../database/conn.js").conn;
//const dateTimeConverter = require("../utils/dateTimeConverter.js").dateTimeConverter;

// rutas de vistas
router.get("/", (req,res) => {
    /*res.render("bicing_main", {
        session: req.session.idUser
    });*/
    res.render("main")
});

router.get("/register", (req,res) => {
    /*if (req.session.idUser){
        res.redirect("/perfil_usuario");
    }
    else{
        res.render("bicing_register", {
            session: req.session.idUser
        });
    }*/
    res.render("register")
});

/*router.get("/bicing_datos_usuario", (req,res) => {
    if (req.session.confirm){
        res.render("bicing_datos_usuario", {
            session: req.session.idUser
        });
    } else {
        res.redirect("/bicing_register");
    }
});*/

router.get("/login", (req,res) => {
    /*res.render("bicing_login", {
        session: req.session.idUser
    });*/
    res.render("login")
});

/*router.get("/bicing_contacto", (req, res) => {
    res.render("bicing_contacto", {
        session: req.session.idUser
    });
});


// Rutas privadas: Perfil usuario
router.get("/perfil_usuario", (req, res) => {
    if (req.session.idUser) {
        const sql = "select * from alquiler where usuario_dni = ?";
        conn.query(sql, [req.session.DNI], (error, results) => {
            if (error) {
                res.status(500).json("Ha ocurrido un error");
                throw error;
            }

            results.forEach((result) => {
                if (result.Fecha_devolucion == null) {
                    req.session.detector = true;
                } else req.session.detector = false;

                result.Fecha_recogida = dateTimeConverter(result.Fecha_recogida);
                result.Fecha_devolucion = dateTimeConverter(result.Fecha_devolucion);
            });

            res.render("perfil_usuario", {
                session: req.session.idUser,
                user: req.session.username,
                viajes: results,
                detector: req.session.detector
            });
        });
    } else {
        res.status(401).redirect("/");
    }
});

//Ruta para alquilar bici
router.get("/alquilar_bici", (req, res) => {
    if (req.session.idUser) {
        var sql = "select BICICLETA_ID_Bici from alquiler where USUARIO_DNI = ? and Fecha_devolucion is null";
        conn.query(sql, [req.session.DNI], (error, results) => {
            if (error) {
                res.status(500).json("Ha ocurrido un error");
                throw error;
            }
            
            if (results.length == 0){
                sql = "select ID_Bici from bicicleta where estado = 0";
                conn.query(sql, (error, results) => {
                    if (error) {
                        res.status(500).json("Ha ocurrido un error");
                        throw error;
                    }
                    res.render("alquilar_bici", {
                        session: req.session.idUser,
                        user: req.session.username,
                        bicis: results,
                        detector: true
                    });
                });
            } else {
                res.render("alquilar_bici", {
                    session: req.session.idUser,
                    user: req.session.username,
                    bicis: results,
                    detector: false
                });
            }
        });
    } else {
        res.status(401).redirect("/");
    }
});
//

router.post("/getBicis", (req, res) => {
    if (req.session.idUser) {
        console.log(req.body.coord);
        req.body.coord.lat = req.body.coord.lat.toFixed(6);
        req.body.coord.lng = req.body.coord.lng.toFixed(6);
        
        var coordenadas = `${req.body.coord.lat}, ${req.body.coord.lng}`;
        console.log(coordenadas);
        var sql = "select * from alquiler where USUARIO_DNI = ? and Fecha_devolucion is null";
        conn.query(sql, [req.session.DNI], (error, results) => {

            if (results.length == 0){
                var sql = "select ID_Bici from estacion join bicicleta on estacion_id_estacion = id_estacion where coordenadas = ?";
                conn.query(sql, [coordenadas], (error, results) => {
                    if (error) {
                        res.status(500).json("Ha ocurrido un error");
                        throw error;
                    }
                    console.log(results);
                    res.json(results);
                })
            }
            else{
                res.json(results);
            }
        })
    } else{
        res.status(401).redirect("/");
    }
});
   

// RUTA QUE DEVUELVE LAS COORDENADAS DE LAS BICIS
router.get("/getCoordenadas", (req, res) => {
    if (req.session.idUser) {
        const sql = "SELECT * FROM estacion";
        conn.query(sql, (error, results) => {
            if (error) {
                res.status(500).json("Ha ocurrido un error");
                throw error;
            }
            res.json(results)
        });
    } else {
        res.status(401).redirect("/");
    }
});


// Accion de logout
router.get("/logout", (req, res) => {
    if(req.session.idUser) {
        req.session.destroy(error => {
            if (error) throw error;
            res.redirect("/");
        }); 
    } else {
        res.status(401).redirect("/");
    }
});*/



exports.router = router;