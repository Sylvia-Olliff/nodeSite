// app/models/classes

var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
	name : String,
	prestige : Boolean,
	caster : Boolean,
	prereq : String,
	skills : String,
	feats : String,
	bonusFeats : String,
	abilities : {name : String, 
				 desc : String,
				 prereq : String, 
				 lvl : Number, 
				 statBonus : Boolean,
				 skillBonus : Boolean,
				 bonusAmt : Number},
	spellDet : {lvl : Number, base : Number, type: String},
	notes : String,
	book : String,
	page : Number
});

module.exports = mongoose.model('Classes', classSchema);