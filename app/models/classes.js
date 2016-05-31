// app/models/classes

var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
	name : {type: String, required : true, unique : true},
	alignment : {
					LG : Boolean,
					LN : Boolean,
					LE : Boolean,
					NG : Boolean,
					TN : Boolean,
					NE : Boolean,
					CG : Boolean,
					CN : Boolean,
					CE : Boolean
				},
	skills : {type : String, required : true},
	skillPoint : {type : Number, required : true},
	proficiencies : {type : String},
	saves : {
				fortitude : Number,
				reflex : Number,
				will : Number
			},
	notes : String,
	book : String,
	page : Number
});

module.exports = mongoose.model('Classes', classSchema);