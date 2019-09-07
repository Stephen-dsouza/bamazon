require("dotenv").config();
var keys = require("./keys.js");
//for inquirer
var inquirer = require("inquirer");
//for mysql connection and npm package
var mysql = require("mysql");
var connection = mysql.createConnection((keys.sql));

// check connection to the db and run function start 
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

//###START OF FUNCTIONS###
//This function will prompt for the list of actions
var start=function () {
    inquirer.prompt([{
            name: "action",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department",  "Exit"],
            message: "please select from the following options. Select[Exit] to exit",
        }])
        .then(function (answer) {

            switch (answer.action) {
                case ("View Products for Department"):
                    viewAll(start);
                    break;
                case ("View Low Create"):
                    viewLowStock();
                    break;
                case ("Exit"):
                    connection.end();
            }

        });
}
// This function is to select all and return back to start function
function viewAll(next) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        //Inquirer to prompt for product id and quantity
        next();
        
    });
}
