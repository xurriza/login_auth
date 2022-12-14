const Router = require("express");
const router = new Router();
const bcrypt = require('bcrypt');
const conn = require("../database/conn.js").conn;
//const nodeMailer = require("../utils/nodeMailer.js").nodeMailer;
const emailREGEXP = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// ruta de registro (signup)
// Primer formulario de registro

router.post("/register", (req, res) => {
    const datos = req.body;

    // validacion 
    /*if (datos.usuario.length === 0) {
        res.json("Campo nombre vacío");
    }*/ if (datos.email.length === 0) {
        res.json("Campo email vacío");
    } else if (!emailREGEXP.test(datos.email)) {
        res.json("Campo email con formato incorrecto");
    } else if (datos.pass1.length === 0) {
        res.json("Campo contraseña vacío");
    } else if (datos.pass1.length < 8 || datos.pass1.search(/[A-Z]/) < 0 || datos.pass1.search(/[0-9]/) < 0) {
        res.json("Campo contraseña con formato incorrecto");
    } else if (datos.pass2.length === 0) {
        res.json("Campo confirmar contraseña vacío");
    } else if (datos.pass1 !== datos.pass2) {
        res.json("Las contraseñas no coinciden");
    } else {

        // comprobar que no exista otra cuenta igual (correo y username)
        const sql = 'select email from usuario where email = ?';
        conn.query(sql, [datos.email], (error, results) => {
            if (error) {
                res.json("Ha ocurrido un error en la base de datos!");
                throw error;
            }
            if (results.length != 0) {
                res.json("El email introducido ya existe!");
            }
            else {
                const sql_s = 'select email from cuenta where email = ?';
                conn.query(sql_s, [datos.email], (error, results) => {
                    if (error) {
                        res.json("Ha ocurrido un error en la base de datos!");
                        throw error;
                    }
                    if (results.length != 0) {
                        res.json("El email* introducido ya existe!");
                    }
                    else {
                         // encriptacion del password con bcrypt
                        const salt = bcrypt.genSaltSync(10);
                        const hashPass = bcrypt.hashSync(datos.pass1, salt);
                        // creacion de variables auxiliares para el posterior insert en tabla cuenta
                        req.session.usuario = datos.usuario;
                        req.session.email = datos.email;
                        req.session.hashPass = hashPass;
                        req.session.confirm = true;
                        res.json(" ");
                    }
                });
            }
        });
    }
});

// Segundo formulario de registro

router.post("/bicing_datos_usuario", (req, res) => {
    const datos = req.body;


    // validacion 
    if (datos.DNI.length === 0) {
        res.json("Campo DNI* no puede estar vacío");
    } else if (datos.DNI.length != 9 || datos.DNI.search(/[a-zA-Z]/) < 0) {
            res.json("Campo DNI* incorrecto");
    } else if (datos.Nombre.length === 0) {
        res.json("Campo Nombre* no puede estar vacío");
    } else if (datos.Direccion.length === 0) {
        res.json("Campo Dirección* no puede estar vacío");
    } else if (datos.Telefono.length === 0 || datos.Telefono.length != 9) {
        res.json("Ingrese un Teléfono* válido");
    } else if (datos.F_nacimiento.length === 0) {
        res.json("Campo Fecha de nacimiento* vacío");
    } else {

        // comprobar que no exista otra cuenta con el mismo DNI
        const sql_s = 'select DNI from usuario where DNI = ?';
        conn.query(sql_s, [datos.DNI], (error, results) => {
            if (error) {
                res.json("Ha ocurrido un error en la base de datos!");
                throw error;
            }
            if (results.length != 0) {
                res.json("El DNI* introducido ya existe!");
            }
            else {
                const sql_i = 'insert into cuenta values (default, ?, ?, ?, default)';
                conn.query(sql_i, [req.session.usuario, req.session.email, req.session.hashPass], error => {
                    if (error) {
                        res.json("Ha ocurrido un error en la base de datos!");
                        throw error;
                    }

                    const sql_i = 'insert into usuario values (?, ?, ?, ?, ?, default)';
                    conn.query(sql_i, [datos.DNI, datos.Nombre, datos.Direccion, datos.Telefono, datos.F_nacimiento], error => {
                        if (error) {
                            res.json("Ha ocurrido un error en la base de datos!");
                            throw error;
                        }
                        req.session.confirm = false;
                        res.json(" ");
                    });

                });
            }
        });
    }
});

// ruta de inicio de sesión (sigin)
router.post("/bicing_login", (req, res) => {
    const datos = req.body;
    // validacion
    if (datos.usuario.length === 0) {
        res.json("Campo nombre de usuario vacío");
    } else if (datos.pass1.length === 0) {
        res.json("Campo contraseña vacío");
    } else {
        const sql = "select * from cuenta join usuario on id_cuenta = cuenta_id where username = ?";
        conn.query(sql, [datos.usuario], (error, results) => {
            if (error) {
                res.status(500).json("Ha ocurrido un error en el login.");
                throw error;
            }
            if (results.length > 0) {
                // email ok
                //comprobar el password desencriptado
                bcrypt.compare(datos.pass1, results[0].password, (error, isMatch) => {
                    if (error) {
                        res.status(500).json("Ha ocurrido un error en el registro.");
                        throw error;
                    }
                    if (isMatch) {
                        // INICIAR SESION Y REDIRIGIR A LA PAG PERFIL
                        req.session.idUser = results[0].Id_cuenta;
                        req.session.username = results[0].username;
                        req.session.email = results[0].email;
                        req.session.pass = results[0].password;
                        req.session.DNI = results[0].DNI;
                        req.session.detector = false;
                        req.session.cookie.maxAge = 1000 * 60 * 60 * 24; // 1 dia
                        res.status(200).json(" ");
                    } else {
                        res.status(400).json("Contraseña incorrecta");
                    }
                });

            } else {
                res.status(400).json("Usuario no registrado en nuestra app");
            }
        });
    }
});

// Ruta de contacto
router.post("/bicing_contacto", (req, res) => {
    const datos = req.body;
    // validacion 
    if (datos.Nombre.length === 0) {
        res.json("Campo nombre vacío");
    } else if (datos.Email.length === 0) {
        res.json("Campo email vacío");
    } else if (!emailREGEXP.test(datos.Email)) {
        res.json("Campo email con formato incorrecto");
    } else if (datos.Mensaje.length === 0) {
        res.json("Campo mensaje vacío");
    } else if (datos.Mensaje.length < 20) {
        res.json("Campo mensaje con formato incorrecto");
    } else {
        // email con nodemailer
        const html = `
            <div>
                <h1>Datos de formulario de contacto</h1>
                <h2>Nombre: ${datos.Nombre}</h2>
                <h2>Email: ${datos.Email}</h2>
                <h2>Mensaje: ${datos.Mensaje}</h2>
            </div>
        `;

        nodeMailer("ifcd0112cief@gmail.com", "ifcd0112cief@gmail.com", "Datos enviados desde el form de contacto", html)
            .then(result => res.json(result))
            .catch(error => {
                res.json("Ha ocurrido un error en el envío de email");
                throw (error)
            })
    }

});
//


// Accion de alquilar bici
router.post("/alquilar_bici", (req, res) => {
    if (req.session.idUser) {
        const bicicleta = req.body;
        const sql = "call alquilar_bici (?, ?)";
        conn.query(sql, [req.session.DNI, bicicleta.bici], (error) => {
            if (error) {
                res.status(500).json("Ha ocurrido un error al alquilar bici");
                throw error;
            }
            res.json(" ");
        });

    } else {
        res.status(401).redirect("/");
    }
});

router.post("/perfil_usuario", (req, res) => {
    if (req.session.idUser) {
        const datos = req.body;
        // validacion
        if (datos.pass1.length === 0) {
            res.json("Campo contraseña vacío");
        } else {
            bcrypt.compare(datos.pass1, req.session.pass, (error, isMatch) => {
                if (error) {
                    res.status(500).json("Ha ocurrido un error al eliminar la cuenta.");
                    throw error;
                }
                if (isMatch) {
                    const sql = "delete from cuenta where Id_cuenta = ?";
                    conn.query(sql, [req.session.idUser], (error) => {
                        if (error) {
                            res.status(500).json("Ha ocurrido un error al eliminar la cuenta");
                            throw error;
                        } else {
                            res.json(" ");
                        }
                    });
                } else {
                    res.status(400).json("Contraseña incorrecta");
                }
            });
        }
    } else {
        res.status(401).redirect("/");
    }
});
////////


exports.router = router;