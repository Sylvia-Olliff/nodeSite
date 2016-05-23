// app/models/races

var mongoose = require('mongoose');

var raceSchema = mongoose.Schema({
	name : String,
	stats : {"STR" : Number, 
			 "DEX" : Number,
			 "CON" : Number,
			 "INT" : Number,
			 "WIS" : Number,
			 "CHA" : Number},
	specailA : String, //Comma delimited single string of all values
	specailQ : String, //Comma delimited single string of all values
 	spells : String, //Comma delimited single string of all values
	alignments : String, //Comma delimited single string of all values
	notes : String,
	book : String,
	page : Number
});

module.exports = mongoose.model('Races', raceSchema);