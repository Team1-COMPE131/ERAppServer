/**
 * Signup Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
//var newUserId = 0;

app.set('views', __dirname);
app.set('view engine', 'jade');

/*app.get('/signup', function(req, res) {
  res.render('signupForm');
});*/

app.post('/create-expense', function(req, res) {

  console.log('user id ' + req.param('id'));
  console.log('iscorp ' + req.param('isCorp'));
  console.log('vendor '+ req.param('Vendor'));
  console.log('location '+ req.param('Location'));
  console.log('type '+ req.param('Type'));
  console.log('amount '+ req.param('Amount'));
  console.log('currency '+ req.param('Currency'));
  console.log('note '+ req.param('Note'));
  console.log('receipt included '+ Boolean(req.param('Receipt')));

  if(!req.param('id')){
    res.send({"Error": "No user id."});
    return;
  }

  var corpVal = parseInt(req.param('isCorp'));
  var userTableName = corpVal ? "corp_users" : "users";
  sql = "select count(*) as c1 from " + userTableName + " where id='" + req.param('id') + "'";
  console.log("Validate user id sql" + sql);
  
  database.connectDB(sql, database.databasePool, function(err, rows) {
    console.log("User exist:" + rows[0]["c1"] > 0);
    if(rows[0]["c1"] === 0) {
      res.send({"Error": "User id is not valid."});
      return;
    } else {
      //valid user.
      var expenseTableName = corpVal ? "corp_expenses" : "expenses";

      sql = "insert into " + expenseTableName + " (user_id, vendor, location, type, amount, currency, occurred, note, receipt) values ('" + req.param('id') + "', '" + (req.param('Vendor') || "Default Vendor")  + "', '" + (req.param('Location') || "Default Location") + "', '" + (req.param('Type') || "Default Expense") + "', '" + (req.param('Amount') || "0") + "', '" + (req.param('Currency') || "USD") + "', NOW(), " + (req.param('Note') ? "'" + req.param('Note') + "'": "NULL") + ", " + (req.param('Receipt') ? "'" + req.param('Receipt') + "'": "NULL") + ")";
      console.log("Insert sql " + sql);
      database.connectDB(sql, database.databasePool, function(err, rows) {
        if(err) {
          res.send({"Error": "Something went wrong."});
          return;
        } else {
          res.send({"Message": "Congratulations! The expese was submitted successfully."});
          return;
        }
      });  
    }//if
  });

});
module.exports = app;