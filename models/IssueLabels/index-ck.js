var mongoose=require("mongoose"),mongohq_url=process.env.MONGOHQ_URL||"mongodb://heroku:9d7d88ec83810d172f98065cb9398617@flame.mongohq.com:27078/app4216978",db=mongoose.connect(mongohq_url),Schema=db.Schema,Grid=mongoose.mongo.Grid,buffer=new Buffer("Hello world"),gs=new mongoose.mongo.GridStore(mongoose.connection.db,"hello","w",{chuck_size:4096,metadata:{hash_path:"test",hash:"t",name:"hello"}});gs.open(function(a,b){console.log("opened GridStore");var c=new Buffer("Hello world");gs.writeBuffer(c,!0,function(a,b){a?console.log(a):console.log(b.toString())})});var Issue=new Object,IssueLabelSchema=new Schema({name:String,hexColor:String,issues:[Issue]}),IssueLabelModel=db.model("IssueLabelModel",IssueLabelSchema),labels={add:function(a,b,c){var d=new IssueLabelModel;d.name=a;d.hexColor=b;d.save()},getAll:function(a){IssueLabelModel.find({},function(b,c){if(!!b)throw b;a(c)})}};exports.IssueLabels=labels;