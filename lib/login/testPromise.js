var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

var result = "";
sql = "select 'a', 1 from users";
sql2 = "select 'b', 2 from users"
var _this = this;
var row1 = database.connectDB(sql, database.databasePool, function(err, rows) {
	if(err) {
		throw err;
	} else {
		console.log(JSON.stringify(rows));
		return rows;
	}
});
var row2 = database.connectDB(sql2, database.databasePool, function(err, rows) {
	if(err) {
		throw err;
	} else {
		console.log(JSON.stringify(rows));
		return rows;
	}
});
console.log(JSON.stringify(row2));