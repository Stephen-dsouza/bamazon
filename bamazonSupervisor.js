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
            message: "please select from the following options. Select[Exit] to exit\n\n",
        }])
        .then(function (answer) {

            switch (answer.action) {
                case ("View Product Sales by Department"):
                    viewSales();
                    break;
                    case ("Create New Department"):
                        viewDepartment(createDepartment);
                    break;
                case ("Exit"):
                    connection.end();
            }

        });
}
// This function is to select all and return back to start function
function viewSales() {
    var URL="select d.department_id,d.department_name,d.over_head_costs,sum(p.product_sales)as product_sales,d.over_head_costs-p.product_sales as total_profit ";
    URL+="from departments d ,products p ";
    URL+="where d.department_name=p.department_name Group by p.department_name";
    connection.query(URL, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
    });
}


function viewDepartment(next) {
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        //Inquirer to prompt for department name and overhead costs
         next();
        
    });
}
//function for adding department
function createDepartment(){
    inquirer.prompt([{
        name: "departmentName",
        type: "input",
        message: "\n Please enter the department name  ",
    },
    {
            name: "cost",
            type: "input",
            message: "\n Enter the Over head costs for this department  ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
])
.then(function (answer) {
    connection.query(
        "INSERT INTO DEPARTMENTS SET?",
        {
            department_name:answer.departmentName,
            over_head_costs:answer.cost,
        },
        function(err) {
            if (err) throw err;
            console.log("\n\nDepartment added successfully!\n\n");
            // re-prompt the user for if they want to bid or post
            start();
          }
        );
});
}