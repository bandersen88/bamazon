# Bamazon
A Command Line Store Front and Order Management System


Bamazon is a 3 part command line program composed over a Customer, Manager, and Supervisor programs to interact with the Bamazon Store Front.
Bamazon customers can view items and inventory and submit orders.  Bamazon Managers can view all products for sale, view items with low inventory,
 add inventory to a product, and add a new product to the store.  Bamazon Supervisors can view the 

### Bamazon Customer

Step 1) Launch the app by navigating to the direcotory and running the bamazon customer app
```
node bamazonCustomer.js

```

This first prints out a view of all items for sale, along with avaialble inventory and other information.  The customer is asked to select the item the want to purchase
by id and enter the quantity to purchase.
![Lookup Dates for A Band](img/cust1-view-table.jpg)

Once they've entered and submitted an order, and updated inventory view is presented along with a summary and cost of the order.
![Concert Dates Returned](img/cust2-submit-order.jpg)


If insufficient quantity exists, the order is blocked from completing, the customer is informed and sent return to the order placement function
![Concert Dates Returned](img/cust3-inventory.jpg)
