var express = require('express');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user.js');
var session = require('express-session');
var login = require('./routes/login.js');
var register = require('./routes/register.js');


app.use(session({
  secret:'ghost',
  key:'user',
  resave:true,
  saveUninitialized:false,
  cookie:{maxAge:30*60*1000, secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, function(username, password, done){
  User.findAndComparePassword(username, password, function(error, isMatch, user){
    if(error){
      return done(error);
    }
    if(isMatch){
      return done(null, user);
    }
    else{
      return done(null, false);
    }
  });
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findByID(id, function(error, user){
    if(error){
      return done(error);
    }
    done(null, user);
  });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function(request, response){
  response.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.use('/login', login);
app.use('/register', register);

app.use('/api', function(request, response, next){
  if(request.isAuthenticated()){
    next();
  } else {
    response.sendStatus(403)
  }
});


var port = process.env.PORT || 3000;
var session = app.listen(port, function(){
  console.log('Server listening on port', port);
});
