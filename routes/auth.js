/*
 * GET Login.
 */

exports.in = function(req, res){
	res.render('auth/in', { layout: 'auth/layout', title: 'Authenticate'});
};