var labels = require('../IssueLabels');
/*
 * GET home page.
 */

exports.index = function(req, res){
	var issueLabels = labels.IssueLabels;
  	res.render('index', { title: 'Express' })
};