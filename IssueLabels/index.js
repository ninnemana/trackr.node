var mongoose = require('mongoose');

var mongohq_url = process.env.MONGOHQ_URL || 'mongodb://heroku:9d7d88ec83810d172f98065cb9398617@flame.mongohq.com:27078/app4216978';

var db = mongoose.connect(mongohq_url),
	Schema = db.Schema;

// Remove this once you create the Issue model
var Issue = new Object();

var IssueLabelSchema = new Schema({
	name: String,
	hexColor: String,
	issues: [Issue]
});

var IssueLabelModel = db.model('IssueLabelModel', IssueLabelSchema);

var labels = {
	add: function(name, hex, callback){
		var label = new IssueLabelModel();
		label.name = name;
		label.hexColor = hex;
		label.save();
	},
	getAll: function(callback){
		IssueLabelModel.find({}, function(err, docs){
			if(!err){
				callback(docs);
			}else{
				throw new Exception(err);
			}
		});
	}
};

exports.IssueLabels = labels;