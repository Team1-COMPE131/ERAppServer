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

app.post('/signup', function(req, res) {

	console.log('email '+ req.param('Username'));
	console.log('pwd '+ req.param('Password'));
	console.log('fname '+ req.param('FirstName'));
	console.log('lname '+ req.param('LastName'));
	console.log('pwd2 '+ req.param('ConfirmPassword'));
	console.log('iscorp '+ req.param('isCorp'));
	console.log('corpname '+ req.param('CorpName'));
	var corpVal = parseInt(req.param('isCorp'));
	
	if (corpVal == 0) { //Signup for normal user ::
		sql = "select count(*) as c1 from users where email='" + req.param('Username') + "'";
		console.log("Duplicate count sql" + sql);
		
		database.connectDB(sql, database.databasePool, function(err, rows) {
			console.log('Duplicate count' + rows[0]["c1"]);
			if(rows[0]["c1"] > 0) {
				res.send({"Error": "Credentials already exists."});
				return;
			} else {
				if(req.param('Password') !== req.param('ConfirmPassword')) {
					res.send({"Error": "Passwords do not match."});
					return;
				} else {
					sql = "insert into users (fName, lName, email, password) values ('" +
							req.param('FirstName') + "', '" + req.param('LastName') +
							"', '" + req.param('Username') + "', '" + req.param('Password') + "')";
					console.log("Insert sql " + sql);
					database.connectDB(sql, database.databasePool, function(err, rows) {
						if(err) {
							res.send({"Error": "Something went wrong."});
							return;
						} else {
							res.send({"Message": "Congratulations! You signed up for ERApp."});
							return;
						}
					});
				}
			}
		});
	} else if (corpVal == 1) { //Sign up for corporate user
		sql = "select count(*) as c1 from corp_users where email='" + req.param('Username') + "'";
		console.log("Duplicate count sql" + sql);
		
		database.connectDB(sql, database.databasePool, function(err, rows) {
			console.log('Duplicate count' + rows[0]["c1"]);
			if(rows[0]["c1"] > 0) {
				res.send({"Error": "Credentials already exists."});
				return;
			} else {
				if(req.param('Password') !== req.param('ConfirmPassword')) {
					res.send({"Error": "Passwords do not match."});
					return;
				} else if(req.param('CorpName') === "") {
					res.send({"Error": "No Organization name defined."});
					return;
				} else {
					sql = "insert into corp_users (fName, lName, email, password, corpName) values ('" +
							req.param('FirstName') + "', '" + req.param('LastName') +
							"', '" + req.param('Username') + "', '" + req.param('Password') + "', '" +
							req.param('CorpName') + "')";
					console.log("Insert sql " + sql);
					database.connectDB(sql, database.databasePool, function(err, rows) {
						if(err) {
							res.send({"Error": "Something went wrong."});
							return;
						} else {
							res.send({"Message": "Congratulations! You signed up for ERApp with organization " + req.param('CorpName')});
							return;
						}
					});
				}
			}
		});
	} else {
		res.send({"Error": "Something went wrong."});
		return;
	}

});
module.exports = app;