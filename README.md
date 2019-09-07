# bamazon
* An Amazon-like storefront. The app will take in orders from customers and deplete stock from the store's inventory.
T
## HOW TO USE
* Create the database schema using "schema.sql"
* Add the data using data from"data.sql".

**Note: I have assumed you are already familar with mysql creation and usage"**
* Clone this repo and create a .env file and add the following "password='your database password'"
* Run "npm i" to download mysql and inquirer packages.

 ## **bamazonCustomer**
 The app should then prompt users with two messages.

   * The first will ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.
   
 Once the customer has placed the order, The application will check if your store has enough of the product to meet the customer's request.

   * If not, the app should log a phrase like `Insufficient quantity available.We currently have "selected item stock " available`, and then prevent the order from going through.

However, if the store _does_ have enough of the product, the app willfulfill the customer's order.

   * Once the update goes through, The customer the total cost of their purchase.





  
  
