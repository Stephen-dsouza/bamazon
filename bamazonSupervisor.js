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
                case ("View Product Sales by Department"):
                    viewAll();
                    break;
                    case ("Create New Department"):
                    break;
                case ("Exit"):
                    connection.end();
            }

        });
}
// This function is to select all and return back to start function
function viewAll() {
    var URL="select d.department_id,d.department_name,d.over_head_costs,sum(p.product_sales)as product_sales,d.over_head_costs-p.product_sales as total_profit ";
    URL+="from departments d ,products p ";
    URL+="where d.department_name=p.department_name Group by p.department_name";

    console.log(URL);
    connection.query(URL, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
        
    });
}
