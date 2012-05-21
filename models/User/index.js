var mongoose = require('mongoose');

var mongohq_url = process.env.MONGOHQ_URL || 'mongodb://heroku:9d7d88ec83810d172f98065cb9398617@flame.mongohq.com:27078/app4216978',
    db 			= mongoose.connect(mongohq_url),
	Schema 		= db.Schema,
	User 		= new Object();

function validUsername(u){
	return u.length > 7;
};

function validEmail(e){
	return e.length > 0;
};

function validPass(p){
	return p.length > 5;
};

var UserSchema = new Schema({
	username: { type: String, unique: true, default: "", required: true, validate: [validUsername, 'Nickname is not valid. Must be at least 8 characters']},
	email: { type: String, unique: true, required: true, validate: [validEmail, 'E-mail is not valid']},
	password: { type: String, required: true, validate: [validPass, 'Password is not valid. Must be at least 6 characters']},
	date_added: { type: Date, default: Date.now },
	img: { data: Buffer, contentType: String},
	fname: String,
	lname: String,
	clearance: { type: String, default:"user", required:true}
});

mongoose.model('UserModel',UserSchema);
var User = mongoose.model('UserModel');

var UserModel = function(){};

UserModel.prototype.add = function(callback){
	var user = new User();
	user.username = this.username;
	user.email = this.email;
	user.password = this.password;
	user.img = this.img;
	user.fname = this.fname;
	user.lname = this.lname;
	user.clearance = this.clearance || "user";
	user.save(function(err, user){
		callback(err);
	});
};
UserModel.prototype.get = function(id, username, email, callback){
	if(id !== undefined){
		User.findById(id, function(err, user){
			if(err === undefined){
				throw new Error('Failed to find user: ' + err);
			}else{
				callback(user);
			}
		});
	}else if(username !== undefined){
		User.findOne({ username: username}, function(err,user){
			if(err === undefined){
				throw new Error('Failed to find user: ' + err);
			}else{
				callback(user);
			}
		});
	}else if(email !== undefined){
		User.findOne({ email: email}, function(err,user){
			if(err === undefined){
				throw new Error('Failed to find user: ' + err);
			}else{
				callback(user);
			}
		});
	}else{
		throw new Error('Cannot find User without reference.');
	}
};
UserModel.prototype.login = function(callback){
	User.findOne({ $or:[{username: this.username}, {email: this.username}], password: this.password}, function(err,user){
		if(err === undefined){
			throw new Error('Failed to find user: ' + err);
		}else{
			callback(user);
		}
	});
}
UserModel.prototype.getAll = function(callback){
	User.find({}, function(err, users){
		if(err === undefined){
			throw new Error('Failed to get users: ' + err);
		}else{
			callback(users);
		}
	});
}
UserModel.prototype.create = function(callback){
	var query = { _id : this._id };
	var updates = { fname: this.fname, lname: this.lname, email: this.email }

	User.update(query, {$set: updates}, callback);

};
UserModel.prototype.deleteById = function(callback){
	var conditions = { _id : this._id };
	User.remove(conditions, callback);
}


module.exports = UserModel;

