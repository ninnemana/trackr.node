var User = require('../models/User'),
	Module = require('../models/Modules'),
	IssueLabel = require('../models/IssueLabels'),
	IconClasses = require('../models/IconClasses'),
	IssueBadge = require('../models/IssueBages'),
	async = require('async');

/*
 * GET home page.
 */
exports.index = function(req, res){
	var crumbs = [
		{
			"name": "Home",
			"link": "/admin",
			"active": true
		}
	];
	res.render('admin/index', { title: 'Express', locals: { crumbs: crumbs } });
};

exports.users = {
	index: function(req, res){
		var u = new User();
		u.getAll(function(resp){
			var crumbs = [
				{
					"name": "Home",
					"link": "/admin"
				},
				{
					"name": "Users",
					"link": "/admin/users",
					"active": "true"
				}
			];
			var users = resp || [];
			res.render('admin/users/index.ejs', {title: 'Users', locals: { users: users, crumbs: crumbs}, layout: 'admin/layout.ejs'});
		});
	},
	settings: function(req, res){
		
		var u = new User(),
			id = req.params.id;
		u.get(id, null, null, function(resp){
			var user = resp || auth.User;
			var crumbs = [
				{
					"name": "Home",
					"link": "/"
				},
				{
					"name": "Users",
					"link": "/admin/users"
				},
				{
					"name": user.fname + " " + user.lname,
					"link": "/admin/user/" + user._id + "/settings",
					"active": "true"
				}
			];
			res.render('admin/users/settings.jade', { title: 'Settings', locals: { user: user, crumbs: crumbs }, layout: 'admin/layout.ejs'});
		});
	},
	save: function(req, res){
		var user = new User();
		user._id = req.params.id;
		user.fname = req.body.fname;
		user.lname = req.body.lname;
		user.email = req.body.email;
		user.create(function(err){
			if(!err){
				res.redirect('/admin/users');
			}else{
				res.redirect('/admin/user/' + user._id + '/settings?err=' + err);
			}
		});
	},
	del: function(req, res){
		var user = new User();
		user._id = req.params.id;
		user.deleteById(function(err, numAffected){
			if(!err && numAffected > 0){
				res.send('');
			}else{
				res.send(err, 404);
			}
		});
	}
};

exports.mods = {
	index: function(req,res){
		var mod = new Module();
		mod.findAll(function(mods){
			var crumbs = [
				{
					"name": "Home",
					"link": "/"
				},
				{
					"name": "Modules",
					"link": "/admin/mods",
					"active": true
				}
			];
			res.render('admin/modules/index.jade', { title: 'Modules', locals: { mods: mods, crumbs: crumbs }, layout: 'admin/layout.ejs'});
		});
	},
	edit: function(req,res){
		var module = new Module(),
			mod = new Module(),
			crumbs = [],
			classes = [];

		async.parallel([
				function(callback){
					mod._id = req.params.id;
					mod.find(function(resp_module){
						module = resp_module;
						crumbs = [
							{
								"name": "Home",
								"link": "/admin"
							},
							{
								"name": "Modules",
								"link": "/admin/mods"
							},
							{
								"name": module.name.length > 0 ? "Edit " + module.name + " Module" : "New Module",
								"link": "#",
								"active": true
							}
						];
						callback();
					});
				},function(callback){
					var iconClass = new IconClasses();
					iconClass.all(function(err, resp){
						classes = resp;
						callback();
					});
				}
			],function(err, results){
				res.render('admin/modules/create.jade', {
					title: module.name.length > 0 ? "Edit " + module.name : "New Module",
					locals: {
						module: module,
						crumbs: crumbs,
						classes: classes,
						error: req.query["err"]
					},
					layout: 'admin/layout.ejs'
				});
			});
		
	},
	save: function(req, res){
		var mod = new Module();
		mod._id = req.params.id;
		mod.name = req.body.name;
		mod.path = req.body.path;
		mod.icon = req.body.icon;
		mod.clearance = req.body.clearance;
		console.log(mod._id);
		mod.create(function(err){
			if(!err){
				res.redirect('/admin/mods');
			}else{
				res.redirect('/admin/mods/' + mod._id + '?err=' + err);
			}

		});
	},
	del: function(req, res){
		var mod = new Module();
		mod._id = req.params.id;
		mod.deleteById(function(err, numAffected){
			if(!err && numAffected > 0){
				res.send('');
			}else{
				res.send(err, 404);
			}
		});
	}
};

exports.labels = {
	index: function(req, res){
		var label = new IssueLabel();
		label.getAll(function(err, labels){
			if(err){
				labels = [];
			}
			var crumbs = [
				{
					"name": "Home",
					"link": "/"
				},
				{
					"name": "Labels",
					"link": "/admin/labels",
					"active": true
				}
			];
			res.render('admin/labels/index.jade', { title: 'Issue Labels', locals:{ labels: labels, crumbs: crumbs }, layout: 'admin/layout.ejs'});
		});
	},
	edit: function(req, res){
		var label = new IssueLabel(),
			crumbs = [],
			badges = [];
		async.parallel([
			function(callback){
				var iLabel = new IssueLabel();
				iLabel._id = req.params.id;
				iLabel.find(function(resp_label){
					label = resp_label;
					crumbs = [
						{
							"name": "Home",
							"link": "/admin"
						},
						{
							"name": "Labels",
							"link": "/admin/labels"
						},
						{
							"name": label.name.length > 0 ? "Edit " + label.name : "New Issue Label",
							"link": "#",
							"active": true
						}
					];
				});
				callback();
			},
			function(callback){
				var badge = new IssueBadge();
				badge.all(function(err, resp){
					badges = resp;
					callback();
				});
			}
		],function(err, results){
			res.render('admin/labels/create.jade', {
				title: label.name.length > 0 ? "Edit " + label.name : "New Issue Label",
				locals: {
					label: label,
					crumbs: crumbs,
					badges: badges,
					error: req.query["err"]
				},
				layout: 'admin/layout.ejs'
			});
		});
	},
	save: function(req, res){
		var label = new IssueLabel();
		label._id = req.params.id;
		label.name = req.body.name;
		label.cssClass = req.body.cssClass;
		console.log(label._id);
		label.create(function(err){
			if(!err){
				res.redirect('/admin/labels');
			}else{
				res.redirect('/admin/labels/' + label._id + '?err=' + err);
			}
		});
	},
	del: function(req, res){

	},
	pushBadges: function(req, res){
		var badges = new IssueBadge();
		//badges.push();
		res.redirect('/admin/labels');
	}
}