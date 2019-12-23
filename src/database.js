const mongoose = require("mongoose");
const { mongodb } = require("./keys");

//mongoose recibe params: direccion y objeto de config. Para no poner todo eso acá, se puede tarer desde el keys
mongoose
	.connect(mongodb.URI, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(db => console.log("database conectada"))
	.catch(err => console.log(err));
