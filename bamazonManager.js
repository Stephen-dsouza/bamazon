//for .env to save sql keys
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

function start() {
    inquirer.prompt([{
            name: "action",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            message: "please select if you wish to purchase or exit",
        }])
        .then(function (answer) {

            switch (answer.action) {
                case ("View Products for Sale"):
                    viewAll();
                    break;
                case ("View Low Inventory"):
                    viewLowStock();
                    break;
                case ("Add to Inventory"):
                    addQuantity();
                    break;
                case ("Add New Product"):
                    addProduct();
                    break;
                case ("Exit"):
                    connection.end();
            }

        });
}

function viewAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        //Inquirer to prompt for product id and quantity
        start()
    });

}