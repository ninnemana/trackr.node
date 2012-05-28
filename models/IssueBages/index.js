var mongoose = require('mongoose');

var mongohq_url = process.env.MONGOHQ_URL || 'mongodb://heroku:9d7d88ec83810d172f98065cb9398617@flame.mongohq.com:27078/app4216978',
    db 			= mongoose.connect(mongohq_url),
	Schema 		= db.Schema,
	IssueBadge	= new Object();

var BadgeSchema = new Schema({
	name: {type: String, unique: true, default:"Default", required:true},
	cssClass: {type: String, unique: true, default:"badge", required:true}
});

mongoose.model('IssueBadge', BadgeSchema);
IssueBadge = mongoose.model('IssueBadge');

var BadgeModel = function(){};

BadgeModel.prototype.all = function(callback){
	IssueBadge.find({},callback)
}


module.exports = BadgeModel;