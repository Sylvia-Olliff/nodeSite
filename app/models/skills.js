// app/models/skills

var mongoose = require('mongoose');

var skillSchema = mongoose.Schema({
	name : {type: String, unique : true, required : true},
	classes : {type: String, required : true},
	attribute : {type: String, required : true},
	synergies : String, 
	synerAmt : Number,
	short : {type: String, required : true},
	desc : {type: String, required : true},
	book : {type: String, required : true},
	page : {type: Number, required : true}
});

module.exports = mongoose.model('Skills', skillSchema);