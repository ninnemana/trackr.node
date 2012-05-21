var User = require('../models/User'),
	Module = require('../models/Modules');
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
			var users = resp || new Array();
			res.render('admin/users/index.ejs', {title: 'Users', locals: { users: users, crumbs: crumbs}, layout: 'admin/layout.ejs'});
		})
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
		})
	},
	delete: function(req, res){
		var user = new User();
		user._id = req.params.id;
		user.deleteById(function(err, numAffected){
			if(!err && numAffected > 0){
				res.send('');
			}else{
				res.send(err, 404);
			}
		})
	}
}

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
		})
	},
	edit: function(req,res){
		var mod = new Module();
		mod._id = req.params.id;
		mod.find(function(module){
			var crumbs = [
				{
					"name": "Home",
					"link": "/admin"
				},
				{
					"name": "Modules",
					"link": "/admin/mods"
				},
				{
					"name": module.name.length > 0 ? "Edit " + module.name : "New Module",
					"link": module.path.length > 0 ? module.path : "",
					"active": true
				}
			];
			res.render('admin/modules/create.jade', { 
				title: module.name.length > 0 ? "Edit " + module.name : "New Module", 
				locals: { 
					module: module, 
					crumbs: crumbs,
					error: req.query["err"]
				}, 
				layout: 'admin/layout.ejs'
			});
		})
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

		})
	},
	delete: function(req, res){
		var mod = new Module();
		mod._id = req.params.id;
		mod.deleteById(function(err, numAffected){
			if(!err && numAffected > 0){
				res.send('');
			}else{
				res.send(err, 404);
			}
		})
	}
}