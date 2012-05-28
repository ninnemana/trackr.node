var mongoose = require('mongoose');

var mongohq_url = process.env.MONGOHQ_URL || 'mongodb://heroku:9d7d88ec83810d172f98065cb9398617@flame.mongohq.com:27078/app4216978',
    db 			= mongoose.connect(mongohq_url),
	Schema 		= db.Schema,
	Module 		= new Object();

var ModuleSchema = new Schema({
	name: {type: String, unique: true, default:"", required:true, validate: []},
	path: {type: String, default:"/", required: true},
	clearance: {type: String, default:"basic", required: true},
	icon: {type: String, default:"icon-tag"}
});

mongoose.model('ModuleModel', ModuleSchema);
Module = mongoose.model('ModuleModel');

var ModuleModel = function(){};

ModuleModel.prototype.findAll = function (type, callback) {
	if(typeof type === 'function'){
		callback = type;
		Module.find({}, function (err, mods){
			if(!err){
				callback(mods);
			}else{
				callback(new Array());
			}
		})
	}else{
		Module.find({ clearance: type }, function (err, mods){
			if(!err){
				callback(mods);
			}else{
				callback(new Array());
			}
		})
	}
	
}

ModuleModel.prototype.find = function(callback){
	Module.findById(this._id,function(err, mod){
		if(!err && mod != undefined){
			callback(mod);
		}else{
			callback(new Module());
		}
	})
}

ModuleModel.prototype.create = function(callback){
	var query = { _id: this._id },
		updates = {name: this.name, path: this.path, icon: this.icon, clearance: this.clearance };

	Module.update(query, {$set: updates}, {upsert: true}, callback);
}

ModuleModel.prototype.deleteById = function(callback){
	var conditions = { _id : this._id };
	Module.remove(conditions, callback);
}

module.exports = ModuleModel;


