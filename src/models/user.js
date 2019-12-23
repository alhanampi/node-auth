const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //cifrar datos

const { Schema } = mongoose;

const userSchema = new Schema({
	email: String,
	password: String
});

//encriptar:
userSchema.methods.encryptPass = password => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //ejecuta 10 veces el algoritmo de cifrado. 10 es el standard. Conviene hacerlo asíncrono
};

//desencriptar:
userSchema.methods.comparePass = function(password) {
	return bcrypt.compareSync(password, this.password);
	//recibe el pass y lo compara con el que está en el schema, por eso el this. El return es booleano
};

module.exports = mongoose.model("users", userSchema); //users es la coleccion donde se va a guardar
