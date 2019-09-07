DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products  (
  item_id INT(10)AUTO_INCREMENT primary key ,
  product_name VARCHAR(100)  NOT NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL
);

CREATE TABLE departments(
  department_id INT(20) AUTO_INCREMENT primary key,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL);

  ALTER TABLE `bamazon`.`products` 
ADD COLUMN `product_sales` DECIMAL(10,2) NULL DEFAULT 0 AFTER `stock_quantity`,
ADD UNIQUE INDEX `product_name_UNIQUE` (`product_name` ASC) VISIBLE;
;

