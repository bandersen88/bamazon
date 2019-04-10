//TODO: How should connection closing/opening be handled
//TODO: How do I properly set up promises?  Each db operation should be promise based.
//TODO: Try to get some Sequelize/formal sql writing in here
//TODO: put the crud functions off in another module
//TODO: add a store resest button that resets all the quantities

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
  readProducts().then((result) => {
    buyProduct();
  });
  
});
    // getQtyPromise(answer.id).then((result) =>{  
    // });

 

//Promise function
function getQtyPromise(id) {
    return new Promise(function(resolve, reject) {
        //Do a thing, possibly async, then…
        connection.query("SELECT stock_quantity FROM products WHERE ?",
        {
            item_id: id
        }, function(err, res) {
          if (err) {
              reject(Error(err));
          } else {
              resolve(res[0].stock_quantity);
          }
        
        });
      });
}

function buyProduct() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "Enter the id of the product you'd like to buy",
            name: "id"
        },
        {
            type: "input",
            message: "How many units would you like to buy?",
            name: "qty"
        }
    ])
    .then(function(answer) {

        // console.log("Answer below:");
        // console.log(answer);
        getQtyPromise(answer.id).then((result) =>{
            if(result >= parseInt(answer.id)) {
                var newQty = result - parseInt(answer.qty);
                console.log("id: " + answer.id);
                console.log("New Quantity: " + newQty);
                updateProduct(answer.id,newQty);
                readProducts();
                
            }
        });
        // console.log(currentQty);
        // if(currentQty >= parseInt(answer.qty)) {
        //     console.log("There's enough left");
        // }
        // getQuantity(answer.id).then(function(response) {
        //     console.log("Success!", response);
        // })
        // if(parseInt(getQuantity(answer.id)) > parseInt(answer.qty)){
        //     console.log("hi")
        // }
        
    })
}

//does not close the connection
// function getQuantity(id) {

//     return new Promise(function(resolve, reject) {
//         // console.log("Selecting all products...\n");
        // connection.query("SELECT stock_quantity FROM products WHERE ?",
        // {
        //     item_id: id
        // }, function(err, res) {
        //   if (err) {
        //       reject(Error(err));
        //   } else {
        //       resolve(res[0].stock_quantity);
        //   }
        
        // });

//     }
// }

function createProduct() {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      flavor: "Rocky Road",
      price: 3.0,
      quantity: 50
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
      // Call updateProduct AFTER the INSERT completes
    //   updateProduct();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function updateProduct(id, qty) {
  console.log("Updating all Rocky Road quantities...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: qty
      },
      {
        item_id: id
      }
    ],
    function(err, res) {
        console.log("Full response");
        console.log(res); 
        console.log(res.affectedRows);
        console.log(err);
    //   readProducts();
      // Call deleteProduct AFTER the UPDATE completes
    //   deleteProduct();
    connection.end();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function deleteProduct() {
  console.log("Deleting all strawberry icecream...\n");
  connection.query(
    "DELETE FROM products WHERE ?",
    {
      flavor: "strawberry"
    },
    function(err, res) {
      console.log(res.affectedRows + " products deleted!\n");
      // Call readProducts AFTER the DELETE completes
    //   readProducts();
    }
  );
}

function readProducts() {

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

function getQtyPromise(id) {
    return new Promise(function(resolve, reject) {
        //Do a thing, possibly async, then…
        connection.query("SELECT stock_quantity FROM products WHERE ?",
        {
            item_id: id
        }, function(err, res) {
          if (err) {
              reject(Error(err));
          } else {
              resolve(res[0].stock_quantity);
          }
        
        });
      });
}
