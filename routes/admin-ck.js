var User=require("../models/User"),Module=require("../models/Modules");exports.index=function(a,b){var c=[{name:"Home",link:"/admin",active:!0}];b.render("admin/index",{title:"Express",locals:{crumbs:c}})};exports.users={index:function(a,b){var c=new User;c.getAll(function(a){var c=[{name:"Home",link:"/admin"},{name:"Users",link:"/admin/users",active:"true"}],d=a||new Array;b.render("admin/users/index.ejs",{title:"Users",locals:{users:d,crumbs:c},layout:"admin/layout.ejs"})})},settings:function(a,b){var c=new User,d=a.params.id;c.get(d,null,null,function(a){var c=a||auth.User,d=[{name:"Home",link:"/"},{name:"Users",link:"/admin/users"},{name:c.fname+" "+c.lname,link:"/admin/user/"+c._id+"/settings",active:"true"}];b.render("admin/users/settings.jade",{title:"Settings",locals:{user:c,crumbs:d},layout:"admin/layout.ejs"})})},save:function(a,b){var c=new User;c._id=a.params.id;c.fname=a.body.fname;c.lname=a.body.lname;c.email=a.body.email;c.create(function(a){a?b.redirect("/admin/user/"+c._id+"/settings?err="+a):b.redirect("/admin/users")})},"delete":function(a,b){var c=new User;c._id=a.params.id;c.deleteById(function(a,c){!a&&c>0?b.send(""):b.send(a,404)})}};exports.mods={index:function(a,b){var c=new Module;c.findAll(function(a){var c=[{name:"Home",link:"/"},{name:"Modules",link:"/admin/mods",active:!0}];b.render("admin/modules/index.jade",{title:"Modules",locals:{mods:a,crumbs:c},layout:"admin/layout.ejs"})})},edit:function(a,b){var c=new Module;c._id=a.params.id;c.find(function(c){var d=[{name:"Home",link:"/admin"},{name:"Modules",link:"/admin/mods"},{name:c.name.length>0?"Edit "+c.name:"New Module",link:c.path.length>0?c.path:"",active:!0}];b.render("admin/modules/create.jade",{title:c.name.length>0?"Edit "+c.name:"New Module",locals:{module:c,crumbs:d,error:a.query.err},layout:"admin/layout.ejs"})})},save:function(a,b){var c=new Module;c._id=a.params.id;c.name=a.body.name;c.path=a.body.path;c.icon=a.body.icon;c.clearance=a.body.clearance;console.log(c._id);c.create(function(a){a?b.redirect("/admin/mods/"+c._id+"?err="+a):b.redirect("/admin/mods")})},"delete":function(a,b){var c=new Module;c._id=a.params.id;c.deleteById(function(a,c){!a&&c>0?b.send(""):b.send(a,404)})}};