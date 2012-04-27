//var labels = require('../IssueLabels');
/*
 * GET home page.
 */

exports.index = function(req, res){
	var modules = [];
	//var mondules = modules.getUserModules();
	res.render('admin/index', { title: 'Express', locals: { modules: modules} });
};