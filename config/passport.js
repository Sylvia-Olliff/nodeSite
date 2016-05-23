// config/passport.js

var userDataStrategy = require('passport-local').Strategy;

var User 		  = require('../app/models/user');
var MessageBox    = require('../app/models/messages');

module.exports = function(passport) {

	// ***********************************************************
	// passport session setup ************************************
	// ***********************************************************
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// ***********************************************************
	// userData SIGNUP **********************************************
	// ***********************************************************

	passport.use('userData-signup', new userDataStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {

		process.nextTick(function() {
			User.findOne({ 'userData.username' : username}, function(err, user) {
				if (err)
					return done(err);	

				if (user) {
					return done(null, false, req.flash('signupMessage', 'That user already exists.'));
				} else {
					var newUser 			= new User();
					var newMessageBox       = new MessageBox();
					var currentDate			= new Date();
					newUser.userData.username	= username;
					newUser.userData.password 	= newUser.generateHash(password);
					newUser.userData.updated_on = currentDate;
					newUser.userData.created_on = currentDate;
					newUser.userData.prof_pic = '';
					newMessageBox.owner = username;
					newMessageBox.inbox.from = "test";
					newMessageBox.inbox.to = "test";
					newMessageBox.inbox.subject = "test";
					newMessageBox.inbox.content = "test";
					

					if (username == "TITANJC") {
						newUser.userData.admin = true;
					} else {
						newUser.userData.admin = false;
					}

					newUser.save(function(err) {
						if(err)
							throw err;
						newMessageBox.save(function(err) {
							if(err)
								throw err;
							return done(null, newUser, newMessageBox);
						});
					});
				}
			});
		});
	}));


	// ***********************************************************
	// userData LOGIN ***********************************************
	// ***********************************************************

	passport.use('userData-login', new userDataStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		User.findOne({ 'userData.username' : username }, function(err, user) {
			if (err) 
				return done(err);

			if(!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'));

			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password!'));
			
			return done(null, user);
		});
	}));
};