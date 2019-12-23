const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; //strategy es la forma en que se nombran los métodos de autentificación
const User = require("../models/user");

//local-signup es como se va a llamar el método, y va a ser usado en la ruta cuando se reciban los datos

//passport usa dos métodos para serializar y deserializar datos. Serialize va a recibir el usuario y el done del usuario y almacenarlo en el navegador:
passport.serializeUser((user, done) => {
	//le paso el null porque lo que se quiere guardar no es un error sino un user .id
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	//este User es el del modelo
	const user = await User.findById(id);
	done(null, user);
});

//la estrategia recibe dos parametros: un objeto de configuración y un callback. El objeto dice qué datos se reciben, la funcion, qué se va a hacer (validar, almacenar, devolver mensajes)
passport.use(
	"local-signup",
	new LocalStrategy(
		{
			//los values son los datos que vienen desde el form
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true //esta permite que se reciban datos req en el callback
		},
		//save es asincrono, por eso va a requerir un async:
		//done es también una funcion callback. Se usa para dar respuesta al cliente
		async (req, email, password, done) => {
			//primero valido que el correo no exista:
			const user = await User.findOne({ email: email }); //busca y mira si coinciden
			console.log(user)

			if (user) {
				//si el correo existe, retorna done y termina la validacion. Null porque no es error, falso porque no devuelve usuario
				return done(
					null,
					false,
					req.flash("signupMessage", "El usuario ya existe.")
				); //flash recibe dos parámetros, nombre de la variable y mensaje
			} else {
				//creo objeto user en blanco, y hago que sea igual a los datos que estoy recibiendo
				const newUser = new User();
				newUser.email = email;
				//no le paso el pass directamente, sino que la paso dentro del método que creé en user
				newUser.password = newUser.encryptPass(password);

				await newUser.save();
				done(null, newUser); //ese null es porque no quiere guardar errores
			}
		}
	)
);

passport.use(
	"local-login",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true
		},
		async (req, email, password, done) => {
			const user = await User.findOne({ email: email });
			if (!user) {
				return done(
					null,
					false,
					req.flash("loginMessage", "no se encontró usuario")
				); //null para el error, falso para el user porque no lo quiero autenticar
			}
			if (!user.comparePass(password)) {
				return done(
					null,
					false,
					req.flash("loginMessage", "password incorrecto")
				);
			}
			done(null, user); //si todo es correcto, devuelve esto, no necesita mensaje
		}
	)
);
