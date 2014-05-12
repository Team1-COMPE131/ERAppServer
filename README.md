Installation and Environment setup for ERApp Server

# ERApp
Technology: Node.js, MySQL, Javascript
1. Install Node.js on the server platform
	a. Download relevant node package according to platform
	http://nodejs.org/download/
	b. If Windows, Download Windows package and run the Exe file
	c. Set HOME Environment in Control Panel -> Environment Variables
	d. If Linux, gunzip the download package
	e. Set export PATH=$PATH:<node package directory>

2. Setup MySQL database
	a. Download MySQL Community Server edition
	http://dev.mysql.com/downloads/
	b. If Windows, Download Windows package and run the Exe file
	c. Set HOME Environment in Control Panel -> Environment Variables
	d. If Linux, gunzip the download package, make file and run the ./install.sh
		installation script
	e. Set export PATH=$PATH:<MySQL package directory>
	f. Run included File credb.sql with any user with create table privileges

3. Required NPM Modules
	a. Refer to package.json included in the delivered code
	b. Dependency of Node modules for running ERApp servers are:
		Express, mysql
	c. Install node modules using the following command
		npm install -g express mysql

4. Running the server
	a. The following command runs the server given Environment in 
		Step 1,2,3 is fully setup
		node app.js
		
## Usage
1. The server provides REST API's and can be used by any client using HTTP.
2. Running the server through node app.js
3. Following are the list of API's provided by the server:
	POST create-expense
	POST deleteExpense
	POST expenses
	POST getCsv
	POST home
	POST login
	POST logout
	POST showExpense
	POST signup
	POST sortedExpenses
	POST updateExpense
4. Internal API's used
	database module

## Developing
1. Modules and API's can be developed for ERApp.
2. Database module is the interface developed in ERApp for database access
	offering following API's
	database.connectDB(sql, database.databasePool, callback)
3. Use Ecplise or Any IDE with Node Perspective for development.
4. Express server app must be created with every module and exported for use of app.js

### Tools
1. Setting up Eclipse
2. Download Eclipse from the following site:
	https://www.eclipse.org/downloads/
3. Download and install the correspoding package.
	a. If Windows, run the EXE file included in the download.
	b. For linux, gunzip the download package, make file, run ./install.sh
		installation script
4. Download Eclipse Plugin node-11.0.2 for use with ERApp.
5. Use of MySQL WorkBench for Database Development for ERApp.
6. Download MySQL WorkBench community server edition from the following link:
	http://dev.mysql.com/downloads/tools/workbench/
7. Install the Package
	a. If Windows, run the EXE file included in the download.
	b. For linux, gunzip the download package, make file, run ./install.sh
		installation script	

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
