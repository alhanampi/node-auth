const express = require("express");
const engine = require("ejs-mate");
const morgan = require("morgan"); //respuesta de https
const path = require("path"); //para no tener que dar toda la ruta windows , para hacer rutas multiplataforma
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash"); //enviar mensajes entre multiples paginas. Es un middleware

/* ***** */

//inicializaciones:
const app = express();
require("./database");
require("./passport/local-auth");

/* *** */

//settings:

//motor de vistas
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");

//port:
app.set("port", process.env.PORT || 5500);

/* ***** */

//middlewares:
app.use(morgan("dev"));
//recibir datos desde form:
app.use(express.urlencoded({ extended: false })); //extended es porque no voy a recibir objetos pesados como imagenes
app.use(
	session({
		//comprobar que no esté vulnerable:
		secret: "secretsessionstring", //esto podria traerlo desde keys, es una clave secreta para la session
		resave: false,
		saveUninitialized: false //no se requiere inicializacion previa
	})
);
app.use(flash()); //debe ir antes de passport
app.use(passport.initialize()); //inicializar passport
app.use(passport.session()); //ahi es donde passport almacena los datos

app.use((req, res, next) => {
	//locals es una forma de almacenar a lo largo de toda la app
	app.locals.signupMessage = req.flash('signupMessage') 
	app.locals.loginMessage = req.flash('loginMessage') 
	next() //con next va a continuar el resto de las rutas
})

//routes:
app.use("/", require("./routes/index"));

/* ***** */
//server start:
app.listen(app.get("port"), () => {
	console.log("server en", app.get("port"));
});
