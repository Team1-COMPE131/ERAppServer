/**
 * Delete expense API
 */

var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');

app.post('/deleteExpense', function(req, res) {
	//Getting {id: userId, isCorp: 0,1, expenseID: num}
	console.log('iscorp '+ req.param('isCorp'));
	console.log('id '+ req.param('id'));
	console.log('expenseId '+ req.param('expenseId'));

	//check invalid params
	if(isNaN(parseInt(req.param('isCorp'))) || req.param('isCorp') == "") {
		res.send({"Error": "Invalid isCorp received"});
		return;
	}

	if(isNaN(parseInt(req.param('id'))) || req.param('id') == "") {
		res.send({"Error": "Invalid userId received"});
		return;
	}

	if(isNaN(parseInt(req.param('expenseId'))) || req.param('expenseId') == "") {
		res.send({"Error": "Invalid expenseId received"});
		return;
	}	

	//Execute API code
	var corpVal = parseInt(req.param('isCorp'));
	if (corpVal == 0) { //delete expense for normal user ::
		sql = "delete from expenses where user_id=" + req.param('id') + 
		" and id=" + req.param('expenseId');
		console.log("user delExp sql " + sql);
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if(err) {
				res.send({"Error": "Unable to delete expense right now"});
				return;
			} else {
				res.send({"Message": "Success"});
				return;
			}
		});
	} else if (corpVal ==  1) { //delete expense for corporate user
		sql = "select count(*) as c1 from corp_expenses where user_id=" + req.param('id') +
		" and id=" + req.param('expenseId');
		console.log("check exp sql " + sql);
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if(err) {
				res.send({"Error": "Unable to delete expense right now"});
				return;
			} else if (rows[0]["c1"] == 0) {
				res.send({"Error": "You can not delete other users' expenses."});
				return;
			} else {
				sql = "delete from corp_expenses where user_id=" + req.param('id') + 
				" and id=" + req.param('expenseId');
				console.log("corpUser delExp sql " + sql);
				database.connectDB(sql, database.databasePool, function(err, rows) {
					if(err) {
						res.send({"Error": "Unable to delete expense right now"});
						return;
					} else {
						res.send({"Message": "Success"});
						return;
					}
				});		
			}
		});
	} else {
		res.send({"Error": "Unable to delete expense"});
		return;		
	}
});

module.exports = app;