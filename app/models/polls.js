// app/models/polls

var mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
	name 		: String,
	active  	: Boolean,
	users		: [String],
	labels 		: [String], 
	votes 		: [Number],
	answerDesc	: [String],
	created 	: Date,
	deactivated : Date
			
});

module.exports = mongoose.model('Polls', pollSchema);