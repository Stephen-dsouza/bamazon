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

//###START OF FUNCTIONS###
//This function will prompt for the list of actions
function start() {
    inquirer.prompt([{
            name: "action",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            message: "please select from the following options. Select[Exit] to exit",
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
// This function is to select all and return back to start function
function viewAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        //Inquirer to prompt for product id and quantity
        start()
    });
}


function viewLowStock() {

    var query = connection.query("SELECT * FROM ?? where stock_quantity<5 ", ['products'], function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        console.log(query.url);
        start()
    });
}

//This function selects all the items and then runs the function addQuantityprompt to promp for stock update
function addQuantity() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        addQuantityprompt();
    });
}

function addQuantityprompt() {
    inquirer.prompt([{
                name: "itemID",
                type: "input",
                message: "\n Please enter the item ID of the product you wish to update ",
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
                message: "\n Please enter the quantity you wish to update to the current available quantity",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var updatedID = answer.itemID;
            var updatedQuantity = parseFloat(answer.quantity);
            var updatedProduct;
            var columns = ["product_name", "stock_quantity"];
            var query = connection.query("SELECT ?? FROM products where item_id=?", [columns, updatedID], function (err, res) {
                if (err) throw err;
                updatedQuantity += res[0].stock_quantity;
                updatedProduct = res[0].product_name;
                console.log(query.url);
                console.log(updatedProduct);
                console.log(updatedQuantity);

                connection.query("UPDATE products set ? where ?",
                    [{
                            stock_quantity: updatedQuantity
                        },
                        {
                            item_id: updatedID
                        }
                    ],
                    function (error) {
                        if (error) throw error;
                        console.log("\n Quantity updated!! \n\n The current quantity for  " + updatedProduct + " is " + updatedQuantity + "\n\n");
                        start()
                    }
                );
            });
        });
}


function addProduct(){
    inquirer.prompt([{
        name: "productName",
        type: "input",
        message: "\n Please enter the product name  ",
        
    },
    {
            name: "productDepartment",
            type: "input",
            message: "\n Which department does the product belong to?  ",
            
        },
        {
            name: "price",
            type: "input",
            message: "\n Please enter the unit price",
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
        message: "\n Please enter the quantity",
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
        "INSERT INTO PRODUCTS SET?",
        {
            product_name:answer.productName,
            department_name:answer.productDepartment,
            price:answer.price,
            stock_quantity:answer.quantity
        },
        function(err) {
            if (err) throw err;
            console.log("product added successfully!");
            // re-prompt the user for if they want to bid or post
            viewAll();
          }
        );
});

}

