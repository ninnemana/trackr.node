var labels = require('../IssueLabels');
/*
 * GET home page.
 */

exports.index = function(req, res){
	var issueLabels = labels.IssueLabels;
	console.log(issueLabels);
	issueLabels.getAll(function(labels){
		console.log(labels);
		res.render('index', { title: 'Express' })
	});
};