var User	= require('../models/User'),
	helpers = require('../db_helpers');


/*
 * GET Login.
 */

exports.login = function(req, res){
	var error = typeof req.query.error == 'undefined' ? false : true;
	res.render('auth/in', { layout: 'auth/layout', title: 'Authenticate', locals: { error: error }});
};

exports.allowed = function(req, res){
	var user = new User();
	user.username = req.body.username;
	user.password  = req.body.password;

	user.login(function(user){
		if(user === null){
			res.redirect('/auth?error');
		}else{
			req.session.user = {
				provider: 'login',
				nick: user.username,
				clearance: user.clearance
			};
			res.redirect('/admin');
		}
	});
};

exports.create = function(req, res){
	var error = typeof req.query.error === 'undefined' || req.query.error === '' ? false : req.query.error.split(','),
		user;
	if(!req.query.user || req.query.user.length === 0){
		user = new User();
		console.log(new User());
	}else{
		user = JSON.parse(req.query.user);
	}
	res.render('auth/create.jade', { layout: 'auth/layout.ejs', title: 'Sign Up', locals: { error: error, user: user}});
};

exports.save = function(req, res){
	try{
		if(!req.body){
			console.log('why you signup nobody?');
			throw new Error('Information did not pass.');
		}
		var user = new User();
		user.username = req.body.nick;
		user.email = req.body.email;
		user.fname = req.body.fname;
		user.lname = req.body.lname;
		user.password = req.body.p1;
		user.add(function(err){
			if(err){
				var list = helpers.stripErrors(err);
				if(list.length === 0){
					if(err.code == 11000){ // Duplicate key error on username
						list.push('A user already exists for that username or e-mail');
					}
				}
				res.redirect('/auth/new?error=' + list + "&user=" + JSON.stringify(helpers.omitter(user,['password'])));
			}else{
				req.session.user = {
					provider: 'signup',
					id: user._id,
					nick: user.username
				};
				req.flash('notice','Welcome!');
				res.redirect('/auth?success');
			}
		});
	}catch(e){
		res.redirect('/auth/new?error=' + e);
	}
};

exports.out = function(req, res){
	req.session.destroy();
	res.redirect("/auth");
};