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
        inquirerLoop();    
  });

  function inquirerLoop() {
    inquirer
    .prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ])
    .then(function(answer) {

        switch(answer.action) {
            case "View Product Sales by Department":
                viewProductSales().then((result) => inquirerContinue());
                break;
            case "Create New Department":
                createNewDepartment().then((result) => inquirerContinue());
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


function createNewDepartment() {

    return new Promise(function(resolve, reject) {
       
        inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "Enter the department name"
            },
            {
                type: "input",
                name: "overhead",
                message: "Enter the overhead costs"
            }
        ])
        .then(function(answer) {
            connection.query("INSERT INTO departments SET ?",
            {
                department_name: answer.department,
                over_head_costs: answer.overhead
            }, function(err, res) {
                if (err) {
                    reject(Error(err));
                } else {
                    console.log("New Department Added");
                }
    
                resolve("success");
                
            });
        })
        
    })
}

//Simple Group by Read oughta do it
function viewProductSales() {

    return new Promise(function(resolve, reject) {
        console.log("Selecting all products...\n");
        connection.query("SELECT * FROM products JOIN departments ON products.department_name = departments.department_name GROUP BY department_name", function(err, res) {
            if (err) {
                reject(Error(err));
            } else {
            var table = new Table({
                head: ['Department', 'Product Sales'],
                colWidths: [20, 10]
            });

            console.log(res);
            // res.forEach(function(r) {
            //     table.push(
            //         [r.department_name, r.product_sales]
            //     );
            // })
            
            // console.log(table.toString());
            // connection.end();
            }

            resolve("success");
            
        });
    })
}
