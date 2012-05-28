var mongoose = require('mongoose');

var mongohq_url = process.env.MONGOHQ_URL || 'mongodb://heroku:9d7d88ec83810d172f98065cb9398617@flame.mongohq.com:27078/app4216978',
    db 			= mongoose.connect(mongohq_url),
	Schema 		= db.Schema,
	LabelClass	= new Object();

var ClassSchema = new Schema({
	name: {type: String, unique: true, default:"", required:true}
});

mongoose.model('LabelClasses', ClassSchema);
LabelClass = mongoose.model('LabelClasses');

var ClassModel = function(){};

ClassModel.prototype.all = function(callback){
	LabelClass.find({},callback)
}


module.exports = ClassModel;