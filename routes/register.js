var router = require('express').Router();
var User = require('../models/user.js');
var path = require('path');

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/register.html'));
});

router.post('/', function(request, response){
  User.create(request.body.username, request.body.password, function(error){
    if(error){
      console.log(error);
      response.sendStatus(500);
    } else{
      response.redirect('/');
    }
  });
});

module.exports = router;
