// app/models/user.js

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// Define Schema for User model
var userSchema = mongoose.Schema({

	userData		: {
		username	: { type: String, required: true, unique: true },
		password 	: { type: String, required: true },
		admin	 	: Boolean,
		created_on  : Date,
		updated_on  : Date,
		prof_pic    : String
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.userData.password);
}

module.exports = mongoose.model('User', userSchema);