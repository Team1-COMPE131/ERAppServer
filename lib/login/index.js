/**
 * Login Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');

/*app.get('/login', function(req, res) {
	res.render('loginForm');
});*/

app.post('/login', function(req, res) {
	//start login
	console.log('iscorp '+ req.param('isCorp'));
	//console.log('corpname '+ req.param('CorpName'));
	console.log('username '+ req.param('Username'));
	console.log('password '+ req.param('Password'));
	
	var corpVal = parseInt(req.param('isCorp'));
	
	if (corpVal == 0) { //login for normal user ::	
		if(req.param('Username') == "" || req.param('Password') == "") {
			res.send({"Error": "Invalid Username or Password"});
			return;
		} else {
			sql = "select id, email from users where email='" + req.param('Username') +
			"' and password=password('" + req.param('Password') + "')";
			console.log("Normal login sql: " + sql);
			database.connectDB(sql, database.databasePool, function(err, rows) {
				if(err || rows.rows == 0) {
					res.send({"Error": "Invalid Username or Password"});
					return;
				} else {
					//req.session.user = rows[0]["id"];
					res.send({"Welcome": req.param('Username'),
						"id": rows[0]["id"],
						"isCorp": 0});
				}
			});
		}
	} else if (corpVal == 1) { //login for corporate user::
		if(req.param('Username') == "" || req.param('Password') == "") {
			res.send({"Error": "Invalid Username or Password"});
			return;
		} else {
			sql = "select id, email from corp_users where email='" + req.param('Username') +
			"' and password=password('" + req.param('Password') + "')";
			console.log("Corp login sql: " + sql);
			database.connectDB(sql, database.databasePool, function(err, rows) {
				if(err || rows.rows == 0) {
					res.send({"Error": "Invalid Username or Password"});
					return;
				} else {
					//req.session.user = rows[0]["id"];
					res.send({"Welcome": req.param('Username'),
						"id": rows[0]["id"],
						"isCorp": 1});
				}
			});
		}
	} else {
		res.send({"Error": "Invalid Username or Password"});
		return;
	}
});

module.exports = app;
