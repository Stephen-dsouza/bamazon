//for .env to save sql keys
require("dotenv").config();
var keys = require("./keys.js");
//for inquirer
var inquirer = require("inquirer");
//for mysql connection and npm package
var mysql = require("mysql");
var connection = mysql.createConnection((keys.sql));


connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  customerPurchase();
});

function customerPurchase() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    // connection.end(res);
    //Inquirer to prompt for product id and quantity
    customerSelection();
  });

}

function customerSelection() {
  inquirer.prompt([{
        name: "itemID",
        type: "input",
        message: "Please enter the item ID of the product you wish to purchase",
        validate: function (value) {
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
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {
      var ID = answer.itemID;
      var columns = ["product_name", "stock_quantity","price"];
      var query = connection.query("SELECT ?? FROM products where item_id=?", [columns, ID], function (err, res) {
        if (err) throw err;
        console.log(answer.quantity);
        console.log(res[0].stock_quantity);
        if (answer.quantity > res[0].stock_quantity) {
          console.log("Insufficient quantity available.We currently have " + res[0].stock_quantity + " available");
          // console.log("valid" +res.stock_quantity);
        } else {
          var remaningStock= res[0].stock_quantity-answer.quantity
          connection.query("UPDATE products set ? where ?",
            [{
                stock_quantity: remaningStock
              },
              {
                item_id: answer.itemID
              }
            ],
            function (error) {
              if (error) throw error;
              var total = (answer.quantity * res[0].price);
              console.log("Purchase successful!");
              console.log("The total of your purchase is: $" + total);
              // connection.end(res);
              customerPurchase()
            }
          );
        }
        
      });
    });
    
}