
//app/routes.js
module.exports = function(app, passport, io, ss, pollHandler, dataHandler) {

	var requestTime = function (req, res, next) {
		process.env.TZ = 'USA/New York';
		req.requestTime = new Date();
		next();
	};

	var multer = require('multer');
	var storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, "D:\\www-test\\public\\uploads");
		},
		filename: function(req, file, cb) {
			cb(null, file.fieldname + '-' + req.user.userData.username + '.png');
		}
	});
	var uploading = multer({
		storage : storage,
		limits: {filesSize: 10000000, files: 1},
	});

	var fs = require('fs');
	var servers = require('./models/servers');
	var server = null;
	var mc_server = null;
	var names = null;

	app.use(function(req, res, next){
		res.locals.success_messages = req.flash('success_messages');
		res.locals.error_messages = req.flash('error_messages');
		next();
	});

	//*******************************************
	// HOME PAGE (with login button) ************
	//*******************************************
	app.use(requestTime);
	app.get('/', requestedOn, function(req, res) {
		if (is_mobile(req)) {
			res.render('mobile/index-mobi.ejs');
		} else {
			res.render('index.ejs');
		}
	});


	//*******************************************
	// LOGIN PAGE *******************************
	//*******************************************
	app.get('/login', requestedOn, function(req, res) {
		if (is_mobile(req)) {
			res.render('mobile/login-mobi.ejs', { message: req.flash('loginMessage') });
		} else {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		}
	});	

	// process the login form
    app.post('/login', requestedOn, passport.authenticate('userData-login', {
    	successRedirect : '/main',
    	failureRedirect : '/login',
    	failureFlash : true
    }));

    //*******************************************
	// SIGNUP  **********************************
	//*******************************************
	app.get('/signup', requestedOn, function(req, res) {
		if (is_mobile(req)) {
			res.render('mobile/signup-mobi.ejs', { message: req.flash('signupMessage') });
		} else {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		}
	});

	// process the signup form
    app.post('/signup', requestedOn, passport.authenticate('userData-signup', {
    	successRedirect : '/main',
    	failureRedirect : '/signup',
    	failureFlash : true
    }));

    //*******************************************
	// MAIN MENU ********************************
	//*******************************************
	app.get('/main', requestedOn, isLoggedIn, function(req, res) {
		if (isAdmin(req)) {
			if(is_mobile(req)) {
				res.redirect('/main-menu-admin-mobi');
			} else {
				res.redirect('/main-menu-admin');
			}
		} else {
			if(is_mobile(req)) {
				res.redirect('/main-menu-mobi');
			} else {
				res.redirect('/main-menu');
			}
		}
	});

	app.get('/main-menu-admin-mobi', requestedOn, isLoggedIn, function(req, res) {
		if (typeof req.param('message') !== 'undefined') {
			res.render('mobile/main-menu-admin-mobi.ejs', {
				user : req.user, // get the user out of session and pass to template
				message : req.param('message')
			});
		} else {
			res.render('mobile/main-menu-admin-mobi.ejs', {
				user : req.user, // get the user out of session and pass to template
				message : ""
			});
		}
	});

	app.get('/main-menu-admin', requestedOn, isLoggedIn, function(req, res) {
		if (typeof req.param('message') !== 'undefined') {
			res.render('main-menu-admin.ejs', {
				user : req.user, // get the user out of session and pass to template
				message : req.param('message')
			});
		} else {
			res.render('main-menu-admin.ejs', {
				user : req.user, // get the user out of session and pass to template
				message : ""
			});
		}
	});

	app.get('/main-menu-mobi', requestedOn, isLoggedIn, pollHandler.pollView, function(req, res) {
		var pollHtml = req.polls.pollHtml;
		if (pollHtml != "FAILED") {
			res.render('mobile/main-menu-mobi.ejs', {
				user : req.user, // get the user out of session and pass to template
				pollHtml : pollHtml
			});	
		} else {
			pollHtml = "";
			res.render('mobile/main-menu-mobi.ejs', {
				user : req.user, // get the user out of session and pass to template
				pollHtml : pollHtml
			});
		}
	});

	app.get('/main-menu', requestedOn, isLoggedIn, pollHandler.pollView, function(req, res) {
		var pollHtml = req.polls.pollHtml;
		res.render('main-menu.ejs', {
			user : req.user, // get the user out of session and pass to template
			pollHtml : pollHtml
		});
	});

	app.post('/poll-vote', requestedOn, isLoggedIn, pollHandler.prepVote, pollHandler.pollVote, function(req, res) {
		res.send(req.polls.response);
	});

	app.post('/poll-deactivate', requestedOn, isLoggedIn, pollHandler.pollDeactivate, function(req, res) {
		if (is_mobile(req)) {
			var response = "/mobile/main-menu-admin-mobi?message=" + req.polls.response;
		} else {
			var response = "/main-menu-admin?message=" + req.polls.response;	
		}
		res.send(response);
	});

	//*******************************************
	// POLL CREATE MENU *************************
	//*******************************************
	app.get('/poll-create', requestedOn, isLoggedIn, function(req, res) {
		if (isAdmin(req)) {
			res.render('poll-create.ejs', {
				user : req.user
			})
			
		} else {
			res.redirect('/main');
		}
	});

	app.post('/poll-create', requestedOn, isLoggedIn, pollHandler.prepPoll, pollHandler.pollCreate, function(req, res) {
		var msg;
		switch(req.polls.response) {
			case "SUCCESS":
				console.log(req.polls.response);
				msg = "Poll successfully created";

				break;
			case "ACTIVE":
				console.log(req.polls.response);
				msg = "A poll is already active, you must deactivate it before creating a new poll.";
				break;

			case "EXISTS":
				console.log(req.polls.response);
				 msg = "A poll with that name already exists";
				break;

			default:
				console.log(req.polls.response);
				break;
		}
		if (is_mobile(req)) {
			res.send({redirect : "/mobile/main-menu-admin-mobi?message=" + msg});
		} else {
			res.send({redirect : "/main-menu-admin?message=" + msg});
		}
	});

	app.get('/poll-results', requestedOn, isLoggedIn, pollHandler.pollResults, function(req, res) {
		var pollHtml = req.polls.pollHtml;
		if(isAdmin(req)) {
			if (is_mobile(req)) {
				res.render('mobile/poll-results-mobi.ejs', {
					user : req.user,
					pollHtml : pollHtml
				});
			} else {
				res.render('poll-results.ejs', {
					user : req.user,
					pollHtml : pollHtml
				});
			}
		} else {
			res.redirect('/main');
		}
	});

	//*******************************************
	// MINECRAFT CONTROL MENU *******************
	//*******************************************
	app.get('/minecraft-menu', requestedOn, isLoggedIn, function(req, res) {
		if (typeof req.param('message') !== 'undefined') {
			if(is_mobile(req)) {
				res.render('mobile/minecraft-menu-mobi.ejs', {
					user : req.user, // get the user out of session and pass to template
					message : req.param('message'),
					active: ((server) ? servers.list[server].name : null) 
				});
			} else {
				res.render('minecraft-menu.ejs', {
					user : req.user, // get the user out of session and pass to template
					message : req.param('message'),
					active: ((server) ? servers.list[server].name : null) 
				});
			}
		} else {
			if(is_mobile(req)) {
				res.render('mobile/minecraft-menu-mobi.ejs', {
					user : req.user, // get the user out of session and pass to template
					message : '',
					active: ((server) ? servers.list[server].name : null) 
				});
			} else {
				res.render('minecraft-menu.ejs', {
					user : req.user, // get the user out of session and pass to template
					message : '',
					active: ((server) ? servers.list[server].name : null) 
				});
			}
		}
		
	});

	app.get('/sprop-select', requestedOn, isLoggedIn, function(req, res) {
		var sel = req.param('selection');
		var props = "";
		var propsArray = new Array();
		var namesArray = new Array();

		fs.readFile(servers.directory + servers.list[sel].filePathProp, function(err, data) {
			props = data.toString();
			props = props.split('\n');

			for (var i = 2; i < props.length; i++) {
				namesArray[i-2] = props[i].substr(0,props[i].indexOf('='));
				propsArray[i-2] = props[i].substr(props[i].indexOf('=') + 1);
			}

			if (is_mobile(req)) {
				res.render('mobile/server-props-mobi.ejs', {
					names : namesArray,
					server_name : servers.list[sel].selectName,
					display_name : servers.list[sel].name,
					data : propsArray 
				});
			} else {
				res.render('server-props.ejs', {
					names : namesArray,
					server_name : servers.list[sel].selectName,
					display_name : servers.list[sel].name,
					data : propsArray 
				});
			}
		});
	});

	app.post('/sprop-update', requestedOn, isLoggedIn, function(req, res, next) {
		var writeData = req.body.stringData;
		writeData = writeData.split(',');
		var selection = writeData[0];
		console.log(selection);

		fs.writeFile(servers.directory + servers.list[selection].filePathProp, '#Minecraft server properties\n#\n', function(err){
			if(err) {
        		return console.log(err);
    		}
		});

		for (var i = 1; i < writeData.length; i++) {
			fs.appendFile(servers.directory + servers.list[selection].filePathProp, writeData[i] + "\n", function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
		res.send({redirect : "/minecraft-menu?message='Update Successfull'"});	
		
	});

	app.get('/server-console', requestedOn, isLoggedIn, function(req, res) {
		var Name;
		if(server) {
			Name = server;
		} else {
			Name = servers.list[req.param('selection')].selectName;
		}
		if (is_mobile(req)) {
			res.render('mobile/server-console-mobi.ejs', {
				user : req.user,
				name : Name,
				displayName : servers.list[Name].name
			});
		} else {
			res.render('server-console.ejs', {
				user : req.user,
				name : Name,
				displayName : servers.list[Name].name
			});
		}
		
	});

	io.on('connection', function (socket) {
		var proc = require('child_process');
		var check = 2;
		

		socket.on('get_status', function() {
			socket.emit('status', server);
		});
		socket.on('start', function(name) {
			if(mc_server) {
				socket.emit('fail', 'start');
				return;
			} else {
				server = name;
			}

			mc_server = proc.spawn(
					'java',
					[
						servers.minMem,
						servers.maxMem,
						servers.parm1,
						servers.parm2,
						servers.parm3,
						servers.parm4,
						servers.parm5,
						servers.fileType,
						servers.list[server].filePathServ,
						servers.gui,
						'-o',
						'true'
					],
				{cwd: servers.directory +  servers.list[server].filePathWork}
			);


			mc_server.stdout.on('data', function(data) {
				if (data) {
					io.sockets.emit('console', ""+data);
					if(check == 0) {
						var temp = data.toString().substr(data.indexOf(']') + 2, data.length);
						names = temp.toString().substr(temp.indexOf(']') + 2, temp.length);
						check = 2;
					}

					if(data.indexOf('players online') > -1) {
						check = 1;
					} else {
						check = 2;
					}
					check--;
				}
			});
			mc_server.stderr.on('data', function(data) {
				if (data) {
					io.sockets.emit('console', ""+data);
				}
			});
			mc_server.on('exit', function() {
				mc_server = null;
				server = null;
				io.sockets.emit('status', null);
			});

		});

		socket.on('command', function(cmd, user) {
			if(mc_server) {
				socket.emit('console', user + " Command: " + cmd);
				mc_server.stdin.write(cmd + "\r");
			} else {
				socket.emit('fail', cmd);
			}
		});

		socket.on('list', function() {
			if(mc_server) {
				mc_server.stdin.write("list\r");
			} else {
				socket.emit('fail', "No Active Servers");
			}
		});

		socket.on('checkList', function() {
			if(names != null && names.length > 0) {
				socket.emit('players', names);
			} else {
				socket.emit('players', 'none');
			}
		});

	});

	process.stdin.resume();
	process.stdin.on('data', function(data) {
		if(mc_server) {
			mc_server.stdin.write(data);
		}
	});

	//*******************************************
	// USER PROFILE MENU ************************
	//*******************************************	
	app.get('/user-profile', requestedOn, isLoggedIn, function(req, res) {
		if (is_mobile(req)) {
			res.render('mobile/user-profile-mobi.ejs', {
				user : req.user,
				message : ''
			});
		} else {
			res.render('user-profile.ejs', {
				user : req.user,
				message : ''
			});
		}
	});

	app.post('/pic-profile', requestedOn, isLoggedIn, uploading.single('image'), function(req, res) {
		req.flash('uploadMessage', 'File Uploaded Successfully');
		var User = require('../app/models/user');
		User.findOne({ 
			'userData.username' : req.user.userData.username 
		},
		function(err, user){
			if (err)
				return done(err);
			if (user) {
				User.update(
					{'userData.username' : req.user.userData.username}, 
					{'userData.prof_pic' : "image-" + req.user.userData.username + ".png"},
					{ multi: false},
					function(err, numAffected) {
						if (err) 
							throw err;
					}
				);
			}
		});
		if (is_mobile(req)) {
			res.render('mobile/user-profile-mobi.ejs', { 
				user : req.user,
				message: req.flash('uploadMessage') 
			});
		} else {
			res.render('user-profile.ejs', { 
				user : req.user,
				message: req.flash('uploadMessage') 
			});
		}
	});


	//*******************************************
	// CHARACTER GEN MENU ***********************
	//*******************************************
	app.get('/char-menu', requestedOn, isLoggedIn, function(req, res) {
		if (is_mobile(req)) {
			res.render('mobile/char-menu-mobi.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		} else {
			res.render('char-menu.ejs', {
				user : req.user, // get the user out of session and pass to template
			});
		}
		
	});

	app.get('/feats-entry', requestedOn, isLoggedIn, dataHandler.DND.featForm, function(req, res) {
		res.render('feats-entry.ejs', {
			user : req.user,
			error : "",
			message : "",
			books : req.DND.feats.books
		});
	});

	app.post('/feats-selection', requestedOn, isLoggedIn, dataHandler.DND.featForm, function(req, res) {
		res.send(req.DND.feats.form);
	});

	app.post('/feats-entry', requestedOn, isLoggedIn, dataHandler.DND.featWrite, function(req, res) {
		var msg = req.DND.feats.response;
		var err = req.DND.feats.error;
    	res.send({response : '/feats-entry?error=' + err + '&message=' + msg});
    	
	});

	app.get('/feats-view', requestedOn, isLoggedIn, function(req, res) {
		res.render('feats-view.ejs', {
			user : req.user
		});
	});

	app.post('/feats-view', requestedOn, isLoggedIn, dataHandler.DND.featView, function(req, res) {
		res.send(req.DND.feats.allFeats);
	});

	app.get('/skills-entry', requestedOn, isLoggedIn, dataHandler.DND.skillForm, function(req, res) {
		res.render('skills-entry.ejs', {
			user : req.user,
			books : req.DND.skills.books
		});
	});

	app.post('/skills-entry', requestedOn, isLoggedIn, dataHandler.DND.skillWrite, function(req, res) {
		var msg = req.DND.skills.response;
		var err = req.DND.skills.error;
    	res.send({response : '/char-menu?error=' + err + '&message=' + msg});
    	
	});

	app.get('/skills-view', requestedOn, isLoggedIn, function(req, res) {

		res.render('skills-view.ejs', {
			user : req.user
		});
	});

	app.post('/skills-view', requestedOn, isLoggedIn, dataHandler.DND.skillView, function(req, res) {
		res.send(req.DND.skills.allSkills);
	});

	app.get('/races-entry', requestedOn, isLoggedIn, function(req, res) {
		res.render('races-entry.ejs', {
			user : req.user
		});
	});

	app.get('/races-view', requestedOn, isLoggedIn, function(req, res) {

		res.render('races-view.ejs', {
			user : req.user
		});
	});

	app.get('/classes-entry', requestedOn, isLoggedIn, function(req, res) {
		res.render('classes-entry.ejs', {
			user : req.user
		});
	});

	app.get('/classes-view', requestedOn, isLoggedIn, function(req, res) {

		res.render('classes-view.ejs', {
			user : req.user
		});
	});

	//*******************************************
	// LOGOUT ***********************************
	//*******************************************
	app.get('/logout', requestedOn, function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//*******************************************
	// 404 REROUTE ******************************
	//*******************************************
	app.get('*', requestedOn, function(req, res) {
		if (is_mobile(req)) {
			res.render('mobile/404-mobi.ejs');
		} else {
			res.render('404.ejs');
		}
		
	});
	app.post('*', requestedOn, function(req, res) {
		if (is_mobile(req)) {
			res.render('mobile/404-mobi.ejs');
		} else {
			res.render('404.ejs');
		}
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) 
		return next();

	res.redirect('/');
}

function isAdmin(req) {
	if (req.user.userData.admin) {
		return true;
	} else {
		return false;
	}
}

function is_mobile(req) {
    var ua = req.header('user-agent');
    if (/mobile/i.test(ua)) return true;
    else return false;
};

function requestedOn(req, res, next) {
	if (req.user) {
		var log = 'Requested by ' + req.user.userData.username + ' at ' + req.requestTime;
	} else {
		var log = 'Requested by Anonymous at ' + req.requestTime;
	}
	console.log(log);
	return next();
}