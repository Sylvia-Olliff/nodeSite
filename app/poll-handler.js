// app/poll-handler

var Polls = require('../app/models/polls');

module.exports = {

	pollVote : function(req, res, next) { //needs poll name, user, and their vote
		Polls.findOne({'active' : true},  function(err, poll) {
			if(err)
				throw err;

			if(poll) {
				if(poll.users.indexOf(req.user.userData.username) > -1) {
					req.polls.response = "You have already voted...";
					next();
				} else {
					var index = poll.labels.indexOf(req.polls.vote);
					var voteIndex = {};
					voteIndex['votes.' + index] = 1;
					var query = {'active' : true};
					var update = {$inc : voteIndex, $push : {'users' : req.user.userData.username}};
					var options = {};
					Polls.findOneAndUpdate(query, update, options, function(err, poll){
						if(err)
							throw err;
						req.polls.response = "Voted";
						next();
					});
					
					
				}			
			} else {
				req.polls.response = "FAILED";
				next();
			}
		});
	},

	prepVote : function(req, res, next) {
		var data = req.body.stringData;
		data = data.split(',');
		var name = data[0];
		var vote = data[1];
		req.polls = {
			name : name,
			vote : vote,
			response : ""
		}
		next();
			
	},

	pollCreate : function(req, res, next) {
		Polls.findOne({'name' : req.polls.name}, function(err, poll) {
			if(err)
				throw err;

			if(poll) {
				req.polls.response = "EXISTS";
				next();
			} else {
				Polls.findOne({'active' : true}, function(err, activePoll) {
					if(err)
						throw err;
					if (activePoll) {
						req.polls.response = "ACTIVE";
						next();
					} else {
						var newPoll 	= new Polls();
						var currentDate	= new Date();
						newPoll.name = req.polls.name;
						newPoll.active = true;
						newPoll.users = [];
						newPoll.labels = req.polls.options;
						for (var i = 0; i < newPoll.labels.length; i++) {
							newPoll.votes[i] = 0;
						}
						newPoll.answerDesc = req.polls.descriptions;
						newPoll.created = currentDate;
						newPoll.deactivated = '';

						newPoll.save(function(err) {
							if(err)
								throw err;

							req.polls.response = "SUCCESS";
							next();
						});
					}
				});
				
			}
		});
	},

	prepPoll : function(req, res, next) {
		var data = req.body.stringData;
		data = data.split(',');
		var pollName = data[0];
		var alternate = true;
		var options = new Array();
		var descriptions = new Array();
		for (var i = 1; i < data.length; i++) {
			if (alternate) {
				options.push(data[i]);
				alternate = false;
			} else {
				descriptions.push(data[i]);
				alternate = true;
			}
		}
		req.polls = {
			name : pollName,
			options : options,
			descriptions : descriptions,
			response : ""
		}
		next();
	},

	pollDeactivate : function(req, res, next) {
		var query = {'active' : true};
		var currentDate = new Date();
		var update = {'active' : false, 'deactivated' : currentDate};
		var options = {strict : false};
		Polls.findOneAndUpdate(query, update, options, function(err, poll){
			if(err)
				throw err;
			req.polls = {
				response : "Deactivated"
			}
			next();
		});
	},

	pollView : function(req, res, next) {
		Polls.findOne({'active' : true}, function(err, poll) {
			if (err) 
				throw err;

			if (poll) {
				if (poll.users.indexOf(req.user.userData.username) > -1) {
					req.polls = {
						pollHtml : "FAILED"
					}
					next();
				} else {
					var pollHtml;
					pollHtml = "<form id='pollForm'> " +
								"<h3 id='pollName'>" + poll.name + "</h3><table> ";

					for (var i = poll.answerDesc.length - 1; i >= 0; i--) {
						pollHtml += "<tr><td><input type='radio' name='pollSelect' value='" + poll.labels[i] + 
									"' /><span id='desc'>" + poll.answerDesc[i] + "</span></td></tr>";
					}
					pollHtml += "</table><input id='pollVote' type='button' name'pollVote' value='Vote' />";
					pollHtml += "</form>";
					req.polls = {
						pollHtml : pollHtml
					}
					next();
				}
			} else {
				req.polls = {
					pollHtml : "FAILED"
				}
				next();
			}

		});
	},

	pollResults : function(req, res, next) {
		Polls.findOne({'active' : true}, function(err, poll) {
			if(err)
				throw err;

			if(poll) {
				var pollHtml;
				pollHtml = "<h3>" + poll.name + "</h3><table>";
				for (var i = poll.answerDesc.length - 1; i >= 0; i--) {
					pollHtml += "<tr><td><b>" + poll.answerDesc[i] + "</b></td><td>" + poll.votes[i] + "</td></tr>";
				}
				pollHtml += "</table>";

				req.polls = {
					pollHtml : pollHtml
				}
				next();
			} else {
				req.polls = {
					pollHtml : "<h3>NO ACTIVE POLLS</h3>"
				}
				next();
			}
		});
	}
}