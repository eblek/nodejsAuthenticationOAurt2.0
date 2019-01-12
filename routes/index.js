var express = require('express');
var router = express.Router();
const moment = require('moment');
const databaseConnection = require('../lib/database');
const helper = require('../lib/helper');


router.get('/craeteTableMysql', (req, res) => {
  databaseConnection.getConnection((errrorDatabase, connectionDatabase) => {
    if(errrorDatabase) {
      res.status(500);
      res.json("database connection error");
    }else {
      const sqlQuery = "CREATE TABLE user (id int NOT NULL AUTO_INCREMENT, username VARCHAR(255) UNIQUE, password VARCHAR(500), tokenKey  VARCHAR(900), secretKey VARCHAR(900), tokenTime DATETIME, PRIMARY KEY (id))";
      connectionDatabase.query(sqlQuery, (errCreateTable, craeteTable) => {
        if(errCreateTable) {
          databaseConnection.destroy();
          console.log(errCreateTable);
          res.status(400);
          res.json("bad query error");
          databaseConnection.destroy();
        }else {
          res.status(201);
          res.json("Created");
          databaseConnection.destroy();
        }
      });
    }
  });
});

router.get('/addUsernameToUserTable', (req, res) => {
  databaseConnection.getConnection((errrorDatabase, connectionDatabase) => {
    if(errrorDatabase) {
      res.status(500);
      res.json("database connection error");
    }else {
      const sqlQuery = "INSERT INTO user (username, password) VALUES (?, ?)";
      connectionDatabase.query(sqlQuery, ["OzancanAkkus", "DilekOzcelik"], (errAddData, addData) => {
        if(errAddData) {
          res.status(400);
          res.json("bad query error");
          connectionDatabase.destroy();
        }else {
          res.status(201);
          res.json(JSON.parse(JSON.stringify({"insertid" : addData.insertId})));
          connectionDatabase.destroy();
        }
      });
    }
  });
}); 

router.post('/api/login', (req, res) => {
  databaseConnection.getConnection((errrorDatabase, connectionDatabase) => {
    if(errrorDatabase) {
      res.status(500);
      res.json("Database connection error");
    }else {
      connectionDatabase.query("SELECT id,tokenKey,secretKey,tokenTime FROM user WHERE username = ? AND password = ?", [req.body.username, req.body.password], (errUserItemList, userItemList) => {
        if(errUserItemList){
          res.status(400);
          res.json("bad query errror");
        }else if(userItemList.length > 0) {
          if((helper.apiSecretDateTime(moment(userItemList[0].tokenTime).format("YYYY-MM-DD HH:mm:ss"))) < 120 && (helper.apiSecretDateTime(moment(userItemList[0].tokenTime).format("YYYY-MM-DD HH:mm:ss")))  >= 0) {
            var obj = {"accessToken" : helper.encrypt(userItemList[0].tokenKey), "secretKey" :  helper.encrypt(userItemList[0].secretKey)};
            res.status(200);
            res.json(JSON.parse(JSON.stringify(obj)));
            databaseConnection.destroy();
          }else {
            var apikey = helper.createApiKey(req.body.username, req.body.password, userItemList[0].id);
            apikey = apikey.split("+++---+++___----");
            connectionDatabase.query("UPDATE user SET tokenKey='" +apikey[0]+ "', tokenTime='" +moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "', secretKey='" +apikey[1]+ "' WHERE id='" + userItemList[0].id+ "' ", (errUserItemUpdate, userItemUpdate) => {
              if(errUserItemUpdate) {
              console.log(errUserItemUpdate);
                res.status(400);
                res.json("server query errror");
                connectionDatabase.destroy();
              }else {
                var obj = {"accessToken" : helper.encrypt(apikey[0]), "secretKey" :  helper.encrypt(apikey[1])};
                res.status(200);
                res.json(JSON.parse(JSON.stringify(obj)));
                connectionDatabase.destroy();
              }
            });
          }
        }else {
          res.status(401);
          res.json("login information is incorrect");
          connectionDatabase.destroy();
        }
      });
    }
  });
});


module.exports = router;
