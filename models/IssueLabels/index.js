var mongoose = require('mongoose');

var mongohq_url = process.env.MONGOHQ_URL || 'mongodb://heroku:9d7d88ec83810d172f98065cb9398617@flame.mongohq.com:27078/app4216978',
	db 			= mongoose.connect(mongohq_url),
	Schema 		= db.Schema,
	Label 		= new Object();

var LabelSchema = new Schema({
	name: {type: String, unique: true, default: "", required: true},
	cssClass: {type: String, default: "", required: true}
});

mongoose.model('IssueLabel', LabelSchema);
Label = mongoose.model('IssueLabel');

var LabelModel = function(){};

LabelModel.prototype.add = function(callback){
	var query = { _id: this._id }.
		updates = {name: this.name, cssClass: this.cssClass, };

	Label.update(query, {$set: updates}, {upsert: true}, callback);
}

LabelModel.prototype.getAll = function(callback){
	//Label.find({}, callback);
	Label.find({}, function(err, labels){
		callback(err, labels);
	});
}

LabelModel.prototype.find = function(callback){
	Label.findById(this._id, function(err, label){
		if(!err && label != undefined){
			callback(label);
		}else{
			callback(new Label());
		}
	});
}

LabelModel.prototype.create = function(callback){
	var query = { _id: this._id },
		updates = {name: this.name, cssClass: this.cssClass };

	Label.update(query, {$set: updates}, {upsert: true}, callback);
}

module.exports = LabelModel;