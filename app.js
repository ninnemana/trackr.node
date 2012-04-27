
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/public')
  , admin = require('./routes/admin')
  , auth = require('./routes/auth')
  , labels = require('./IssueLabels')
  , RedisStore = require('connect-redis')(express);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  //app.use(express.cookieDecoder());
  app.use(express.session({ 
    secret: process.env.CLIENT_SECRET || 'j@cks0n',
    maxAge: Date.now + 7200000,
    store: new RedisStore({ maxAge: Date.now * 7200000 })
  }));
  app.use(express.query());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function requiresLogin(req, res, next){
  if(!req.session.user){
    res.redirect('/auth');
  }else{
    next();
  }
};

function loadLabels(req, res, next){
  return labels.IssueLabels.getAll(function(labels){
    res.local('labels',labels);
    next();
  });
}

// Routes

/* Admin Routes */
app.get('/admin', requiresLogin, admin.index);

/* Authenticaton Routes */
app.get('/auth', auth.in);
app.get('/auth/new', auth.create);
app.post('/auth/new', auth.save);
app.post('/auth/allowed', auth.allowed);
app.get('/auth/allowed', auth.in);
app.get('/auth/show',auth.show);


/* Public Routes */
app.get('/', loadLabels, routes.index);


app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
