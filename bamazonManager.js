//TODO: Add viewing product sales

var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    //Need a promise to start buy product, so that buy product waits.
        inquirerLoop();    
  });

function inquirerLoop() {
    inquirer
    .prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
    .then(function(answer) {

        switch(answer.action) {
            case "View Products for Sale":
                viewProducts().then((result) => inquirerContinue());
                break;
            case "View Low Inventory":
                viewLowInventory().then((result) => inquirerContinue());
                break;
            case "Add to Inventory":
                addToInventory().then((result) => inquirerContinue());
                break;
            case "Add New Product":
                addNewProduct().then((result) => inquirerContinue());
                break;
        }

        
    })
}

function inquirerContinue() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                message: "Do you want to perform another action?",
                choices: ["Y", "N"]
            }
        ]).then(function(answer) {

            if(answer.action === "Y") {
                inquirerLoop();
            } else {
                process.exit();
            }
        })
}

function addNewProduct() {

    // console.log("and here");
    return new Promise(function(resolve, reject) {
       
        // console.log("also here");
        inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Enter the product name"
            },
            {
                type: "input",
                name: "department",
                message: "Enter the department name"
            },
            {
                type: "input",
                name: "price",
                message: "Enter the product price"
            },
            {
                type: "input",
                name: "stock_qty",
                message: "Enter the stock quantity"
            }
        ])
        .then(function(answer) {
            // console.log("I am here");
            // console.log(answer);
            connection.query("INSERT INTO products SET ?",
            {
                product_name: answer.name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.stock_qty

            }, function(err, res) {
                if (err) {
                    reject(Error(err));
                } else {
                    console.log("You're item has been added to inventory");
                }
    
                resolve("success");
                
            });
        })
        
    })
}

function addToInventory() {

    return new Promise(function(resolve, reject) {

        viewProducts().then((result) => {
            getProductNameList().then((result) => {
                var choiceArray = [];
                result.forEach(function(element) {
                    choiceArray.push(element[0]);
                })
                inquirer
                .prompt([
                    {
                        type: "list",
                        name: "productName",
                        message: "Select an item to add inventory to",
                        choices: choiceArray
                    }
                ])
                .then(function(answer) {

                    inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "amount",
                            message: "Enter the amount of inventory you'd like to add (integer only)"
                        }
                    ])
                    .then(function(answer2) {

                        addInventoryToProduct(answer.productName, answer2.amount).then((result) => inquirerContinue());
                    })
                    
                });
        })
    })
        
    })
}

function addInventoryToProduct(productName, addToQuantity) {

    return new Promise(function(resolve, reject) {

        var currentQty = 0;
        var updateQuantity = 0;

        connection.query("SELECT stock_quantity FROM products WHERE ?",
        {
            product_name: productName
        }, function(err, res) {
            if (err) {
                reject(Error(err));
            } else {
                currentQty = parseInt(res[0].stock_quantity);
                updateQuantity = currentQty + parseInt(addToQuantity);
                console.log(updateQuantity);
                connection.query("UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: updateQuantity
                  },
                  {
                    product_name: productName
                  }
                ],
                function(err, res) {
                    if (err) {
                        reject(Error(err));
                    } else {
                        resolve("success");
                    }                    
                });
            }
        });
       

    })
}


function getProductNameList() {

    return new Promise(function(resolve, reject) {
       
        connection.query("SELECT product_name FROM products", function(err, res) {
            if (err) {
                reject(Error(err));
            } else {
                // Log all results of the SELECT statement
            var namesArray = [];
            // console.log("Response");
            // console.log(res);
            res.forEach(function(r) {
                namesArray.push(
                    [r.product_name]
                );
            })
            
            }

            resolve(namesArray);
            
        });
    })
}



function viewLowInventory() {

    return new Promise(function(resolve, reject) {
        console.log("Selecting low inventory products...\n");
        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
            if (err) {
                reject(Error(err));
            } else {
                // Log all results of the SELECT statement
            var table = new Table({
                head: ['id', 'Produce Name', 'Department', 'Price', 'Quantity'],
                colWidths: [10, 30, 20, 10, 10]
            });

            res.forEach(function(r) {
                table.push(
                    [r.item_id, r.product_name, r.department_name, r.price, r.stock_quantity]
                );
            })
            
            console.log(table.toString());
            // connection.end();
            }

            resolve("success");
            
        });
    })
}

function viewProducts() {

    return new Promise(function(resolve, reject) {
        console.log("Selecting all products...\n");
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) {
                reject(Error(err));
            } else {
                // Log all results of the SELECT statement
            var table = new Table({
                head: ['id', 'Produce Name', 'Department', 'Price', 'Quantity'],
                colWidths: [10, 30, 20, 10, 10]
            });

            res.forEach(function(r) {
                table.push(
                    [r.item_id, r.product_name, r.department_name, r.price, r.stock_quantity]
                );
            })
            
            console.log(table.toString());
            // connection.end();
            }

            resolve("success");
            
        });
    })
}