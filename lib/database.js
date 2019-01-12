var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 1000,
  host: 'localhost',
  user: 'berkin',
  password: 'elvan',
   timezone: 'utc',
   database: 'userLogin'
});


module.exports = pool;