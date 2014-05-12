/**
 * ERApp Main application file
 */

var express = require("express"),
	app = express();

//Define routing variables
var login = require("./lib/login"),
	signup = require("./lib/signup"),
	database = require("./lib/database"),
	logout = require("./lib/logout"),
	home = require("./lib/home"),
	expenses = require("./lib/expenses"),
	deleteExpense = require("./lib/deleteExpense"),
	updateExpense = require("./lib/updateExpense"),
	showExpense = require("./lib/showExpense"),
	getCsv = require("./lib/getCsv"),
	sortedExpenses = require("./lib/sortedExpenses"),
	createExpense = require("./lib/create_expense");

//App configruation, environment configuration
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


//Make Routing variables available to webserver for redirection
app.use(login);
app.use(signup);
app.use(database);
app.use(logout);
app.use(home);
app.use(expenses);
app.use(deleteExpense);
app.use(updateExpense);
app.use(showExpense);
app.use(getCsv);
app.use(sortedExpenses);
app.use(createExpense);

//Redirect Default Page to Login Page
app.get('/', function(req, res) {
	res.redirect('/login');
});

//Start webserver
app.listen(3000);
console.log("ERApp Server listening on port 3000..");