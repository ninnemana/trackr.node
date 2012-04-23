var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
var mongohq_url = process.env.MONGOHQ_URL;

var db = mongoose.connect(mongohq_url),
	Schema = db.Schema;

var IssueLabelSchema = new Schema({
	name: String,
	hexColor: String
});

var IssueLabelModel = db.model('IssueLabelModel', IssueLabelSchema);

var labels = {
	add: function(name, hex, callback){
		var label = new IssueLabelModel();
		label.name = name;
		label.hexColor = hex;
		label.save();
	}
};

exports.IssueLabels = labels;