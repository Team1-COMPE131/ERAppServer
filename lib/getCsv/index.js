/**
 * Expenses API for index.js
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

var rowsToCsvStr = function(rows){
	console.log("rows:" + rows.toString());
	var csvStr = "",
	headerRowStr = "",
	headerRow = [],
	rowArr = [];
	for (var col in rows[0]){
		if(rows[0].hasOwnProperty(col)){
			headerRow.push(col);
		}
	}
	headerRowStr = headerRow.join(", ");
	rowArr.push(headerRowStr);
	for(var i=0; i<rows.length; i++){
		var rowStr = "",
		colArr = [];
		for (var col in rows[i]){
			if(rows[i].hasOwnProperty(col)){
				colArr.push(rows[i][col]);
			}
		}
		rowStr = colArr.join(", ");
		rowArr.push(rowStr);
	}
	csvStr = rowArr.join("\n");
	console.log("csvStr: "+csvStr);
	return csvStr;
};

app.set('views', __dirname);
app.set('view engine', 'jade');

app.post('/getcsv', function(req, res) {
	//Getting {id: userId, isCorp: 0,1}
	console.log('iscorp '+ req.param('isCorp'));
	console.log('id '+ req.param('id'));

	//check invalid params
	if(isNaN(parseInt(req.param('isCorp'))) || req.param('isCorp') == "") {
		res.send({"Error": "Invalid isCorp received"});
		return;
	}

	if(isNaN(parseInt(req.param('id'))) || req.param('id') == "") {
		res.send({"Error": "Invalid id received"});
		return;
	}

	if(isNaN(parseInt(req.param('filter'))) || req.param('filter') == "") {
		res.send({"Error": "Invalid filter received"});
		return;
	}	

	//Execute API code
	//filter 0 - this year, 1 - this month, 2 - this week
	var corpVal = parseInt(req.param('isCorp'));
	var filter = parseInt(req.param('filter'));
	if (corpVal == 0) { //expenses for normal user ::
		if (filter === 0) {//This year
			sql = "select id as expenseId, vendor, location, type, amount, currency, " +
			"date_format(occurred, '%h:%i %p on %W %D %M %Y') as time, " +
			"receipt, note from expenses where " +
			"user_id = " + req.param('id') + " and " +
			"date_format(occurred, '%Y') = date_format(now(), '%Y')" +
			" order by occurred desc";
			console.log("This year: " + sql);
		} else if (filter === 1) {//This Month
			sql = "select id as expenseId, vendor, location, type, amount, currency, " +
			"date_format(occurred, '%h:%i %p on %W %D %M %Y') as time, " +
			"receipt, note from expenses where " +
			"user_id = " + req.param('id') + " and " +			
			"date_format(occurred, '%Y') = date_format(now(), '%Y')" +
			" and date_format(occurred, '%M') = date_format(now(), '%M') order by occurred desc";
			console.log("This month: " + sql);			
		} else if (filter == 2) {//This week
			sql = "select id as expenseId, vendor, location, type, amount, currency, " +
			"date_format(occurred, '%h:%i %p on %W %D %M %Y') as time, " +
			"receipt, note from expenses where " +
			"user_id = " + req.param('id') + " and " +			
			"abs(datediff(occurred, now())) < 7" +
			" order by occurred desc";
			console.log("This month: " + sql);			
		} else {		
			sql = "select id as expenseId, vendor, location, type, amount, currency, date_format(occurred, '%h:%i %p on %W %D %M %Y') as time," +
			"receipt, note from expenses where user_id = " + req.param('id') + " order by occurred desc";
			console.log("Get expense sql: " + sql);
		}
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if(err) {
				res.send({"Error": "Something went wrong"});
				return;
			} else if (rows.rows == 0) {
				res.send("");
				return;
			} else {
				var csvStr = rowsToCsvStr(rows);
				res.send(csvStr);
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
				if (filter === 0) {//This year
					sql = "select id as expenseId, vendor, location, type, amount, currency, " +
					"date_format(occurred, '%h:%i %p on %W %D %M %Y') as time, " +
					"receipt, note from corp_expenses where " +
					"user_id in (select id from corp_users where corpName='" + corpName + "') and " +
					"date_format(occurred, '%Y') = date_format(now(), '%Y')" +
					" order by occurred desc";
					console.log("This year: " + sql);
				} else if (filter === 1) {//This Month
					sql = "select id as expenseId, vendor, location, type, amount, currency, " +
					"date_format(occurred, '%h:%i %p on %W %D %M %Y') as time, " +
					"receipt, note from corp_expenses where " +
					"user_id in (select id from corp_users where corpName='" + corpName + "') and " +
					"date_format(occurred, '%Y') = date_format(now(), '%Y')" +
					" and date_format(occurred, '%M') = date_format(now(), '%M') order by occurred desc";
					console.log("This month: " + sql);			
				} else if (filter == 2) {//This week
					sql = "select id as expenseId, vendor, location, type, amount, currency, " +
					"date_format(occurred, '%h:%i %p on %W %D %M %Y') as time, " +
					"receipt, note from corp_expenses where " +
					"user_id in (select id from corp_users where corpName='" + corpName + "') and " +
					"abs(datediff(occurred, now())) < 7" +
					" order by occurred desc";
					console.log("This month: " + sql);			
				} else {				
					sql = "select id as expenseId, vendor, location, type, amount, currency, date_format(occurred, '%h:%i %p on %W %D %M %Y') as time," +
					"receipt, note from corp_expenses where user_id in (select id from corp_users where corpName='" + corpName +
					"') order by occurred desc";
					console.log("Get corp expense sql: " + sql);
				}
				database.connectDB(sql, database.databasePool, function(err, rows) {
					if(err) {
						res.send({"Error": "Something went wrong"});
						return;
					} else if (rows.rows == 0) {
						res.send("");
						return;
					} else {
						var csvStr = rowsToCsvStr(rows);
						res.send(csvStr);
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
