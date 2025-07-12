CREATE SCHEMA companies;
CREATE TABLE companies.Employees_table(
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    gender VARCHAR(40) CHECK(gender in('Male','Female')),
    department VARCHAR(120) NOT NULL,
    hire_date DATE NOT NULL,
    salary INT NOT NULL
);
-- DROP TABLE companies.Employees_table;
INSERT INTO companies.Employees_table(first_name,last_name,gender,department,hire_date,salary)
VALUES
('John','Doe','Male','IT','2018-05-01',60000.00),
('Jane','Smith','Female','HR','2019-06-15',50000.00),
('Michael','Johnson','Male','Finance','2017-03-10',75000.00),
('Emily','Davis','Female','IT','2020-11-20',70000.00),
('Sarah','Brown','Female','Marketing','2016-07-30',45000.00),
('David','Wilson','Male','Sales','2019-01-05',55000.00),
('Chris','Taylor','Male','IT','2022-02-25',65000.00);

SELECT * FROM companies.Employees_table;

CREATE TABLE companies.products_table(
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(20) NOT NULL,
    category VARCHAR (20) NOT NULL,
    price INT NOT NULL,
    stock INTEGER NOT NUll
);
INSERT INTO companies.products_table(product_name,category,price,stock) VALUES
('Laptop','Electronics',1200.00,30),
('Desk','Furniture',300.00,50),
('Chair','Furniture',150.00,200),
('Smartphone','Elecronics',800.00,75),
('Monitor','Electronics',250.00,40),
('Bookshelf','Furniture',100.00,60),
('Printer','Electronics',200.00,25);
SELECT * FROM companies.products_table;

CREATE TABLE companies.sales_table(
    sale_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    sale_date DATE NOT NULL,
    quantity INT NOT NULL,
    total INT NOT NULL,
    CONSTRAINT fk_employee_table
    FOREIGN KEY(employee_id) REFERENCES companies.Employees_table(employee_id)
    ON DELETE CASCADE,
    CONSTRAINT fk_products_table
    FOREIGN KEY(product_id) REFERENCES companies.products_table(product_id)
    ON DELETE CASCADEcompanies.sales_table
   
);
-- DROP TABLE companies.sales_table;
INSERT INTO companies.sales_table(product_id,employee_id,sale_date,quantity,total)
VALUES
(1,1,'2021-01-15',2,2400.00),
(2,2,'2021-03-22',1,300.00),
(3,3,'2021-05-10',4,600.00),
(4,4,'2021-07-18',3,2400.00),
(5,5,'2021-09-25',2,500.00),
(6,6,'2021-11-30',1,100.00),
(7,1,'2022-02-15',1,200.00),
(1,2,'2022-04-10',1,1200.00),
(2,3,'2022-06-20',2,600.00),
(3,4,'2022-08-05',3,450.00),
(4,5,'2022-10-11',1,800.00),
(5,6,'2022-12-29',4,1000.00);

SELECT * FROM companies.sales_table;

SELECT * FROM companies.employees_table;
SELECT first_name FROM companies.employees_table;
SELECT DISTINCT department FROM companies.employees_table;
SELECT COUNT(*) FROM companies.employees_table;
SELECT SUM(salary) FROM companies.employees_table;
SELECT AVG(salary) FROM companies.employees_table;
SELECT MAX(salary) FROM companies.employees_table;
SELECT MIN(salary) FROM companies.employees_table;
SELECT COUNT(gender) FROM companies.employees_table WHERE gender ='Male';
SELECT COUNT(gender) FROM companies.employees_table WHERE gender ='Female';
-- SELECT COUNT(gender) FROM companies.employees_table WHERE hire_date >;
SELECT AVG(salary) FROM companies.employees_table WHERE department ='IT';
SELECT department,COUNT(department) AS each_count FROM companies.employees_table GROUP BY department;
SELECT department,SUM(salary) AS total_count FROM companies.employees_table GROUP BY department;
SELECT department,MAX(salary) AS total_count FROM companies.employees_table GROUP BY department;
SELECT department,MIN(salary) AS total_count FROM companies.employees_table GROUP BY department;
SELECT gender,COUNT(gender) AS total_count FROM companies.employees_table GROUP BY gender;
SELECT gender,AVG(salary) AS total_count FROM companies.employees_table GROUP BY gender;

SELECT first_name, salary FROM companies.employees_table ORDER BY salary DESC LIMIT 5;
SELECT DISTINCT COUNT(first_name) FROM companies.employees_table;
SELECT e.first_name FROM companies.sales_table GROUP BY employee_id;
SELECT first_name FROM companies.employees_table ORDER BY hire_date ASC LIMIT 10;
SELECT total FROM companies.sales_table WHERE total = 0 ;
SELECT employee_id,SUM(total) FROM companies.sales_table GROUP BY employee_id;
SELECT employee_id,SUM(total) FROM companies.sales_table GROUP BY employee_id,sales_table.total ORDER BY SUM(total) DESC LIMIT 1; 

SELECT e.first_name, e.last_name, s.product_id, s.sale_date, s.quantity, s.total
FROM companies.employees_table e
LEFT JOIN companies.sales_table s ON e.employee_id = s.employee_id;

SELECT e.department, AVG(s.quantity) AS total_quantity
FROM companies.employees_table e
LEFT JOIN companies.sales_table s ON e.employee_id = s.employee_id
GROUP BY e.department;

SELECT e.first_name,SUM(s.total) AS total_quantity 
FROM companies.employees_table e
LEFT JOIN companies.sales_table s ON e.employee_id = s.employee_id
GROUP BY e.first_name
ORDER BY SUM(s.total) DESC LIMIT 1;

SELECT e.first_name,s.employee_id, SUM(s.quantity) AS total_quantity
FROM companies.employees_table e
LEFT JOIN companies.sales_table s ON e.employee_id = s.employee_id
GROUP BY e.first_name, s.employee_id
ORDER BY SUM(s.quantity) DESC LIMIT 4;

SELECT e.department, SUM(s.quantity) AS total_quantity
FROM companies.employees_table e
LEFT JOIN companies.sales_table s ON e.employee_id = s.employee_id
GROUP BY e.department;


