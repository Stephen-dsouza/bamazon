
//for .env to save sql keys
require("dotenv").config();
var keys = require("./keys.js");
//for inquirer
var inquirer = require("inquirer");
//for mysql connection and npm package
var mysql = require("mysql");
var connection=mysql.createConnection((keys.sql));


  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    customerPurchase();
});

function customerPurchase(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    connection.end(res);
    //Inquirer to prompt for product id and quantity
    customerSelection();
  });
  
}

function customerSelection(){
  inquirer.prompt([{
    name: "itemID",
    type: "input",
    message: "Please enter the item ID of the product you wish to purchase",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  },
  {
    name: "quantity",
    type: "input",
    message: "Please enter the quantity of the product you wish to purchase",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }]);
}