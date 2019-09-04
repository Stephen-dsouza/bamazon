DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products  (
  item_id INT(10)AUTO_INCREMENT primary key ,
  product_name VARCHAR(100)  NOT NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,4) NOT NULL,
  stock_quantity INT NOT NULL
);
INSERT into products(product_name,department_name,price,stock_quantity)
values("Fresh Melon Honeydew","Fruit and Veg",2.30,50),
("Fresh Pink Lady Apple","Fruit and Veg",0.97,500),
("Sodastream Gas Cylinder","Soft Drinks",35.00,20),
("Saxbys Diet Ginger Beer Bottle","Soft Drinks",2.00,25)

