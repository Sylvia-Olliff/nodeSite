// app/models/feats

var mongoose = require('mongoose');

var featSchema = mongoose.Schema({
	name : {type : String, unique : true, uppercase : true, trim : true},
	prereq : {type: String, uppercase : true, trim : true, default: "NONE"},
	type : {type: String, uppercase : true, trim : true, required : true},
	details : {},
	short : {type: String, required : true},
	desc : {type: String, required : true},
	book : {type : String, uppercase : true},
	page : {type: Number, required : true}
});

module.exports = mongoose.model('Feats', featSchema);