const express = require("express");
const router = express.Router();
const passport = require("passport"); //va a traer el signup, asi que puedo reemplazar los req,res,next con eso

//routes:

//start
router.get("/", (req, res, next) => {
	console.log("get inicial!");
	res.render("index"); //renderiza esta vista
});

//signup
router.get("/signup", (req, res, next) => {
	res.render("signup");
});

//autentico con el metodo que cree en el local-auth
router.post(
	"/signup",
	passport.authenticate("local-signup", {
		successRedirect: "/profile", //si todo sale bien, a dónde va
		failureRedirect: "/signup", //a donde va si falla
		failureFlash: true //los datos del request desde el cliente
	})
);

//login
router.get("/login", (req, res, next) => {
	console.log("login get!");
	res.render("login");
});

router.post(
	"/login",
	passport.authenticate("local-login", {
		successRedirect: "/profile",
		failureRedirect: "/login",
		failureFlash: true
	})
);

//autenticacion: es un middleware que va a tener que ser ejecutado cada vez que se cree una ruta
function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		//si el usuario está autenticado, va a continuar, por eso el next. Va a pasar por acá con cada ruta
		return next();
	}
	res.redirect("/signup");
}
//puedo crear una funcion para no autenticado

//redireccion post signup, solo se accede cuando se autentica:
//voy a pasar el isAuthenticated en todos los lugares que quiera autenticar antes de que entre
router.get("/profile", isAuthenticated, (req, res, next) => {
	res.render("profile");
});

//si quisiera autenticar todas las rutas:
/*router.use((req, res, next) => {
  isAuthenticated(req, res, next)
  next()
})*/

//logout:
router.get("/logout", (req, res, next) => {
	req.logOut();
	res.redirect("/");
});

module.exports = router;
