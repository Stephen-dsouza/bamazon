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
      var columns = ["product_name", "stock_quantity"];
      var query = connection.query("SELECT ?? FROM products where item_id=?", [columns, ID], function (err, res) {
        if (err) throw err;
        console.log(answer.quantity);
        console.log(res[0].stock_quantity);
        if (answer.quantity > res[0].stock_quantity) {
          console.log("Insuffiecient quantity available.We currently have " + res[0].stock_quantity + " available");

          // console.log("valid" +res.stock_quantity);
        } else {
          console.log("Invalid");
        }

        connection.end(res);


      });

      // console.log(query.sql);

      // var product=answer.itemID;

      // console.log(product);
      // if(answer.quantity>product.stock_quantity)
      //   console.log("Sorry,Item" +product+" does not have the quanity you requested");
      // });
    });
}