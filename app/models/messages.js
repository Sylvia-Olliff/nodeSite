// app/models/messages.js

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
	
	owner 	: { type: String, required: true},
	inbox	: { from: String, to: String, subject: String, content: String},
	outbox	: { from: String, to: String, subject: String, content: String}
			
});

module.exports = mongoose.model('Messages', messageSchema);