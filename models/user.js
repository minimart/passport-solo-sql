var pg = require('pg');
var connection = 'postgres://localhost:5432/passport';
var config = {
  database: 'passport',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 60000
};
var pool = new pg.Pool(config);
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

function findByUsername(username, callback) {
  pool.connect(function(error, client, done){
    if(error){
      console.log('Connection error: ', error);
      done();
      return callback(error);
    }
    client.query('SELECT * FROM users WHERE username =$1', [username], function(error, result){
      if(error){
        console.log('Connection error: ', error);
        done();
        return callback(error);
      }

      callback(null, result.rows[0]);
      done();
    });
  });
};

function findByID(id, callback) {
  pool.connect(function(error, client, done){
    if(error){
      console.log('Connection error: ', error);
      done();
      return callback(error);
    }
    client.query('SELECT * FROM users WHERE id=$1', [id], function(error, result){
      if(error){
        console.log('Connection error: ', error);
        done();
        return callback(error);
      }
      callback(null, result.rows[0]);
      done();
    });
  });
};

function create(username, password, callback) {
  bcrypt.hash(password, SALT_WORK_FACTOR, function(error, hash){
  pool.connect(function(error, client, done){
    if(error){
      console.log('Connection error: ', error);
      done();
      return callback(error);
    }
    client.query('INSERT INTO users (username, password) '
    +'VALUES ($1, $2) RETURNING id, username;',
    [username, hash],
    function(error, result){
      if(error){
        console.log('Connection error: ', error);
        done();
        return callback(error);
      }

      callback(null, result.rows[0]);
      done();
    });
  });
  });
};

function findAndComparePassword(username, candidatePassword, callback) {
  findByUsername(username, function(error, user){
    if(error){
      console.log('Connection error: ', error);
      done();
      return callback(error);
    }
    bcrypt.compare(candidatePassword, user.password, function(error, isMatch){
      if(error){
        console.log('Connection error: ', error);
        done();
        return callback(error);
      } else {
        console.log('isMatch?', isMatch);
        callback(null, isMatch, user)
      };
    });
  });
};




module.exports = {
  findByUsername: findByUsername,
  findByID: findByID,
  create: create,
  findAndComparePassword: findAndComparePassword
};
