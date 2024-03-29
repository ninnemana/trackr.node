
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes/public'),
    admin = require('./routes/admin'),
    auth = require('./routes/auth'),
    IssueLabel = require('./models/IssueLabels'),
    url = require('url'),
    Module = require('./models/Modules'),
    RedisStore = require('connect-redis')(express);

var app = module.exports = express.createServer();

// Configuration

app.configure('production', function(){
  app.use(express.errorHandler());

  var redisUrl = url.parse(process.env.REDISTOGO_URL || "http://localhost:6379");
  console.log(redisUrl);
  var redisAuth = redisUrl.auth.split(':');

  app.set('redisHost', redisUrl.hostname);
  app.set('redisPort', redisUrl.port);
  app.set('redisDb', redisAuth[0]);
  app.set('redisPass', redisAuth[1]);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  var redisUrl = url.parse("http://localhost:6379");

  app.set('redisHost', redisUrl.hostname);
  app.set('redisPort', redisUrl.port);
  app.set('redisDb', "db");
  app.set('redisPass', "");
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  app.use(express.session({
      secret: 'j@cks0n',
      store: new RedisStore({
          host: app.set('redisHost'),
          port: app.set('redisPort'),
          db: app.set('redisDb'),
          pass: app.set('redisPass')
      })
  }));

  app.use(express.query());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});





function requiresLogin(req, res, next){
  if(!req.session.user){
    res.redirect('/auth');
  }else{
    if(req.session.user.clearance == 'admin'){
      var mod = new Module();
      mod.findAll('sudo',function(arr){
        res.local('global_modules', arr);
        next();
      });
      //var mondules = modules.getUserModules();
      
    }else{
      res.redirect('/');
    }
  }
}

function loadLabels(req, res, next){
  var label = new IssueLabel();
  label.getAll(function(err,labels){
    if(!err){
      res.local('labels', labels);
      next();
    }else{
      res.local('labels',[]);
      next();
    }
    
  });
}

// Routes

/* Authenticaton Routes */
app.get('/auth', auth.login);
app.get('/auth/new', auth.create);
app.post('/auth/new', auth.save);
app.post('/auth/allowed', auth.allowed);
app.get('/auth/allowed', auth.login);
app.get('/auth/out',auth.out);

/* Admin Routes */
app.get('/admin*', requiresLogin);
app.get('/admin', admin.index);

app.get('/admin/badges/push', admin.labels.pushBadges);

app.get('/admin/labels', admin.labels.index);
app.get('/admin/labels/:id?', admin.labels.edit);
app.post('/admin/labels/:id', admin.labels.save);
app.get('/admin/labels/:id/delete', admin.labels.del);




app.get('/admin/users', admin.users.index);
app.get('/admin/user/:id?/settings', admin.users.settings);
app.post('/admin/user/:id/settings', admin.users.save);
app.get('/admin/user/:id/delete', admin.users.del);

app.get('/admin/mods',admin.mods.index);
app.get('/admin/mods/:id?', admin.mods.edit);
app.post('/admin/mods/:id', admin.mods.save);
app.get('/admin/mods/:id/delete', admin.mods.del);


/* Public Routes */
app.get('/*', loadLabels);
app.get('/', loadLabels, routes.index);


app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
