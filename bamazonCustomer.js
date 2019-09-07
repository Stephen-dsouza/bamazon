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

//This will prompt the customer if they wish to make a purchase or exit
function start() {
  inquirer.prompt([{
      name: "action",
      type: "list",
      choices: ["Purchase Item", "Exit"],
      message: "Please select if you wish to purchase a product or select [Exit] to Exit",
    }])
    .then(function (answer) {

      switch (answer.action) {
        case ("Purchase Item"):
          viewAll();
          break;
        case ("Exit"):
          console.log("\n\n\nThank you for shopping. Hope to see you again\n")
          connection.end();
      }

    });
}

// display the items in stock and prompt for selection
function viewAll() {
  var columns = ["item_id","product_name","department_name", "stock_quantity", "price"];
  connection.query("SELECT ?? FROM products",[columns], function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    //Inquirer to prompt for product id and quantity
    customerSelection();
  });

}
//prompt for item and quantity and update if stock available
function customerSelection() {
  inquirer.prompt([{
        name: "itemID",
        type: "input",
        message: "\n Please enter the item ID of the product you wish to purchase ",
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
        message: "\n Please enter the quantity of the product you wish to purchase",
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
      var columns = ["product_name", "stock_quantity", "price","product_sales"];
      connection.query("SELECT ?? FROM products where item_id=?", [columns, ID], function (err, res) {
        if (err) throw err;
        if (answer.quantity > res[0].stock_quantity) {
          console.log("\n Insufficient quantity available.We currently have " + res[0].stock_quantity + " available \n");
          start();

        } else {
          var total = res[0].product_sales+(answer.quantity * res[0].price);
          
          console.log(total);
          var remaningStock = res[0].stock_quantity - answer.quantity
          connection.query("UPDATE products set ? where ?",
            [{
                stock_quantity: remaningStock,
                product_sales: total
              },
              {
                item_id: answer.itemID
              },
              
            ],
            function (error) {
              if (error) throw error;
              
              console.log("\n Purchase successful! \n\n The total cost of the product " +res[0].product_name +" is $ " +total +"\n\n");
              start()
            }
          );
        }
      });
    });

}