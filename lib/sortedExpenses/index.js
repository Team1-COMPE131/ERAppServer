/**
 * Expenses API for index.js
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');

app.post('/expenses', function(req, res) {
  //Getting {id: userId, isCorp: 0,1}
  console.log('iscorp '+ req.param('isCorp'));
  console.log('id '+ req.param('id'));
  console.log('filter '+ req.param('Filter'));

  //check invalid params
  if(isNaN(parseInt(req.param('isCorp'))) || req.param('isCorp') == "") {
    res.send({"Error": "Invalid isCorp received"});
    return;
  }

  if(isNaN(parseInt(req.param('id'))) || req.param('id') == "") {
    res.send({"Error": "Invalid isCorp received"});
    return;
  }

  //Execute API code
  var corpVal = parseInt(req.param('isCorp'));
  if (corpVal == 0) { //expenses for normal user ::
    sql = "select id as expenseId, vendor, location, type, amount, currency, date_format(occurred, '%h:%i %p on %W %D %M %Y') as time," +
    "receipt, note from expenses where user_id = " + req.param('id') + " order by occurred desc";
    console.log("Get expense sql: " + sql);
    database.connectDB(sql, database.databasePool, function(err, rows) {
      if(err) {
        res.send({"Error": "Something went wrong"});
        return;
      } else if (rows.rows == 0) {
        res.send({});
        return;
      } else {
        res.send(rows);
        return;
      }
    });
  } else if (corpVal == 1) { //expenses for corporate user
    //Get userID of all the users that belong to this organization user is logged in with
    sql = "select corpName from corp_users where id = " + req.param('id');
    console.log("corpname sql " + sql);
    database.connectDB(sql, database.databasePool, function(err, rows) {
      if(err || rows.rows == 0) {
        res.send({"Error": "Something went wrong"});
        return;
      } else {
        var corpName = rows[0]["corpName"];
        console.log("Got corp name: " + corpName);
        
        //Query the expenses belonging to this organization
        sql = "select id as expenseId, vendor, location, type, amount, currency, date_format(occurred, '%h:%i %p on %W %D %M %Y') as time," +
        "receipt, note from corp_expenses where user_id in (select id from corp_users where corpName='" + corpName +
        "') order by occurred desc";
        console.log("Get corp expense sql: " + sql);
        database.connectDB(sql, database.databasePool, function(err, rows) {
          if(err) {
            res.send({"Error": "Something went wrong"});
            return;
          } else if (rows.rows == 0) {
            res.send({});
            return;
          } else {
            res.send(rows);
            return;
          }
        });       
      }
    });
  } else {
    res.send({"Error": "Unable to retrieve expenses"});
    return;
  }
});

module.exports = app;