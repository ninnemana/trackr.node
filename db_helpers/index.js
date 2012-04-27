exports.stripErrors = function(mongooseErrs){
	var prop, list = [];
	for(prop in mongooseErrs.errors){
		list.push(mongooseErrs.errors[prop].type)
	}
	return list;
};

exports.omitter = function(obj,keys){
	var dup = {};
	for(key in obj){
		if(keys.indexOf(key) == -1){
			dup[key] = obj[key];
		}
	}
	return dup;
};