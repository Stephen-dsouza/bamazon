DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products  (
  item_id INT(10)AUTO_INCREMENT primary key ,
  product_name VARCHAR(100)  NOT NULL UNIQUE,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sale DECIMAL(10,2) NULL DEFAULT 0
);

CREATE TABLE departments(
  department_id INT(20) AUTO_INCREMENT primary key,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL);

 
