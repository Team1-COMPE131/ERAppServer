/**
 * Update expense API, (don't allow updates after 2 days)
 */

var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');

app.post('/updateExpense', function(req, res) {
	console.log('user id ' + req.param('id'));
	console.log('iscorp ' + req.param('isCorp'));
	console.log('vendor '+ req.param('Vendor'));
	console.log('location '+ req.param('Location'));
	console.log('type '+ req.param('Type'));
	console.log('amount '+ req.param('Amount'));
	console.log('currency '+ req.param('Currency'));
	console.log('note '+ req.param('Note'));
	console.log('receipt included '+ req.param('Receipt'));

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
	var userTableName = corpVal ? "corp_expenses" : "expenses";
	console.log("Using table: " + userTableName);
	sql = "select count(*) as c1 from " + userTableName + " where id=" + req.param('expenseId') +
	" and user_id=" + req.param('id');
	database.connectDB(sql, database.databasePool, function(err, rows) {
		if(err) {
			res.send({"Error": "Something went wrong"});
			return;
		} else if (rows[0]["c1"] == 1) {
			//check if the expense is finalized
			sql = "select abs(datediff(occurred, now())) as difference from " + userTableName +
			" where id=" + req.param('expenseId') + " and user_id=" + req.param('id');
			console.log("check diff sql " + sql);
			database.connectDB(sql, database.databasePool, function(err, rows) {
				if(err) {
					res.send({"Error": "Something went wrong"});
					return;					
				} else if(rows[0]["difference"] > 2){
					res.send({"Message": "You can not update a finalized expense."});
					return;
				} else {
					sql = "update " + userTableName + " set vendor='" + (req.param('Vendor') || "Default Vendor") +
					"', location='" + (req.param('Location') || "Default Location") + "', type='" +
					(req.param('Type') || "Default Expense") + "', amount=" + (req.param('Amount') || "0") +
					", currency='" + (req.param('Currency') || "USD") + "', occurred=now(), receipt=" +
					(req.param('Receipt') ? "'" + req.param('Receipt') + "'": "NULL") + ", note=" +
					(req.param('Note') ? "'" + req.param('Note') + "'": "NULL") + " where id=" +
					req.param('expenseId') + " and user_id=" + req.param('id');
					console.log("update sql " + sql);
					database.connectDB(sql, database.databasePool, function(err, rows) {
						if(err) {
							res.send({"Error": "Something went wrong"});
							return;
						} else {
							res.send({"Message": "Expense updated successfully"});
							return;
						}
					});
				}
			});
		} else {
			res.send({"Error": "You can not update other user's expenses."});
			return;
		}
	});
});

module.exports = app;