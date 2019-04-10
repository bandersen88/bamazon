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

function viewLowInventory() {

    return new Promise(function(resolve, reject) {
        console.log("Selecting all products...\n");
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