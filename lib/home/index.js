/**
 * Home Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/home', function(req, res) {
	if(req.session.userType !== null && req.session.userType === 0) {
		//0 - admin, 1 - premium, 2-simple
		res.render('homeAdmin');
	} else if (req.session.userType !== null && req.session.userType !== 0) {
		res.render('homeUser');
	} else {
		res.render('../login/restricted');
	}
});

module.exports = app;
