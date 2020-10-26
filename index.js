const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require("console.table");

// connects to mysql, and logs if you are connected
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    //username
    user: "test_user",
  
    // password and database
    password: "password",
    database: "employee_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    menu();
  });
//menu function 
  function menu() {
    inquirer
      .prompt({
        name: "name",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all Employees", 
          "View all Departments",
          "View all Roles",
        "View All Employees by Department", 
        "View all Employees by Manager", 
        "Add an Employee",
        "Add a Department",
        "Add a Role",
        "Remove an Employee",
        "Remove a Department",
        "Remove a Role",
        "Update Employee Role", 
        "Update Employee Manager",
        "Quit"
        ],
      })
      .then((val) => {

        console.log(val.name);

        if (val.name === "View all Employees") {
          showEmployees();
        } else if (val.name === "View all Departments") {
          showDepartments();
        } else if (val.name === "View All Employees by Department") {
          showEmploybyDepart();
        } else if (val.name === "View all Employees by Manager") {
          showEmploybyManager();
        } else if (val.name === "Add an Employee") {
          addEmployee();
        } else if (val.name === "Add a Department") {
          addDepartment();
        } else if(val.name === "Add a Role") {
          addRole();
        } else if (val.name === "Remove an Employee") {
          removeEmployee();
        } else if(val.name === "Remove a Department"){
          removeDepartment();
        } else if (val.name === "Remove a Role") {
          removeRole();
        } else if (val.name === "Update Employee Role") {
          updateEmployRole();
        }  else if (val.name === "Update Employee Manager") {
          updateEmployManager();
        } else if (val.name === "View all Roles") {
            showRoles();
         } else if (val.name === "Quit") {
           connection.end();
        }
      });
    };
//displays all from apartment
 function showDepartments(){

  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.log(err);
// Prints Department
    if (res) {
      console.log("\n")
    console.log("-- Departments --")
    console.log('\n')
    console.table(res);}
    
  })
  menu();

 };

 function showRoles(){
   connection.query("SELECT * FROM roles", function (err, res) {
     if (err) throw err;
     console.log(err);

     //Prints Roles
     if (res) {
       console.log("\n")
     console.log("-- Roles --")
     console.log('\n')
     console.table(res);}
    
   })
   menu();
 };

 function showEmployees(){
   connection.query("SELECT * FROM employee", function (err, res) {
     if (err) throw err;
     console.log(err);

     // Prints employeea
     if (res) {console.log("\n")
     console.log("-- Employees --")
     console.log('\n')
     console.table(res);}
   })
   menu();
 };

function showEmploybyDepart (){
   connection.query("SELECT employee.id, employee.first_name, employee.last_name,role.title FROM employee LEFT JOIN role ON employee.role_id=role.id  LEFT JOIN department department on department.department_id = department.id  AT department.id ", function (err, res){
    if (err) throw err;
    console.log(err);
    console.table(res)
    menu();
  })
  
};

function showEmploybyManager(){
  connection.query("SELECT * FROM employee GROUP BY manager_id ORDER BY manager_id ", function (err, res){
    if (err) throw err;
    console.log(err);

    console.table(res)
    menu();
  })
};

//Return Employee obnject
async function returnEmployee() {
  let response = await connection.query("SELECT CONCAT(employee.first_name,' ',employee.last_name) AS fullName, employee.id FROM employee")
  let employeeName = [];
  response.forEach( employee => {
    employeeName.push({ name: employee.fullName, value: employee.id })

  })
  
  return employeeName;


}

async function returnDepartment() {
  let response = await connection.query("SELECT * FROM department")
  let departmentName = [];
  response.forEach( department => {
    departmentName.push({ name: department.name, value: department.id })

  })
  
  return departmentName;

}

async function returnRoles() {
  let response = await connection.query("SELECT role.title, role.id FORM role")
  let roleName = [];
  response.forEach( role => {
    roleName.push({ name: employee.fullName, value: employee.id })

  })
  
  return roleName;


}



function addEmployee(){
  //prompts for new employee info
  inquirer.prompt([{

    type: "input",
    name: "first_name",
    message: "What is the employee's first name?"

  },
  {
    type: "input",
    name: "last_name",
    message:"What is the employee's last name?"
  },
   {
     type: "number",
     name:"role_id",
     message:"What is the employee's role ID?"
   },
   {
     type: "number",
     name:"manager_id",
     message: "What is the employee's manager ID?"
   }
]).then( function (res){
  connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [res.first_name, res.last_name, res.role_id, res.manager_id], function (err, data){
    if (err) throw err;
    console.table("Employee Sucessfully Added");
    menu();
  })
})
};

 function addDepartment () {
   
   inquirer.prompt([{

    type: "input",
    name: "department",
    message: "What kind of department would you like to add?"

  },
]).then( function (res){
  connection.query("INSERT INTO department (name) VALUES(?)", [res.department], function (err, data){
    if (err) throw err;
    console.table("Department Sucessfully Added");
    menu();
  })
})
};

function addRole(){
  //prompts for new employee info
  inquirer.prompt([{

    type: "input",
    name: "title",
    message: "What is the title of this role?"

  },
  {
    type: "number",
    name: "salary",
    message:"What is the salary of this role?"
  },
   {
     type: "number",
     name:"department_id",
     message:"What is the Department ID??"
   },
]).then( function (res){
  connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)", [res.title, res.salary, res.department_id], function (err, data){
    if (err) throw err;
    console.table("Role Sucessfully Added");
    
  })
  menu();
})
}; 

function updateEmployRole(){

  
  inquirer.prompt([{

    type: "input",
    name: "name",
    message: "Which Employee would like to update?(Use last name)"

  },
  {
    type:"number",
    name: "role_id",
    message: "Please enter department ID."
  }
]).then( function (res){
  connection.query("UPDATE employee SET role_id = ? WHERE last_name = ?", [res.role_id, res.name], function (err, data){
    if (err) throw err;
    console.table(data)
    console.table("Employee Sucessfully Updated");
    
  })
  menu();
})
  
}

function updateEmployManager() {

   inquirer.prompt([{

    type: "input",
    name: "name",
    message: "Which Employee would like to update?(Use last name)"

  },
  {
    type:"number",
    name: "manager_id",
    message: "Please enter manager ID."
  }
]).then( function (res){
  connection.query("UPDATE employee SET manager_id = ? WHERE last_name = ?", [res.manager_id, res.name], function (err, data){
    if (err) throw err;
    console.table(data)
    console.table("Employee Sucessfully Updated");
    
  })
  menu();
})

}

function removeEmployee(){

 inquirer.prompt([{

    type: "input",
    name: "name",
    message: "Which Employee would like to remove?(Use last name)"

  },
]).then( function (res){
  connection.query("DELETE FROM employee WHERE last_name = ?", [res.name], function (err, data){
    if (err) throw err;
    console.table(data)
    console.table("Employee Sucessfully Removed");
    
  })
  menu();
})

};

function removeDepartment(){

  inquirer.prompt([{

    type: "input",
    name: "name",
    message: "Which Department would like to remove?"

  },
]).then( function (res){
  connection.query("DELETE FROM department WHERE name = ?", [res.name], function (err, data){
    if (err) throw err;
    console.table(data)
    console.table("Department Sucessfully Removed");
    
  })
  menu();
})

};

function removeRole() {

   inquirer.prompt([{

    type: "number",
    name: "id",
    message: "What is the ID of the role to be removed?"

  },
]).then( function (res){
  connection.query("DELETE FROM roles WHERE id = ?", [res.id], function (err, data){
    if (err) throw err;
    console.table(data)
    console.table("Role Sucessfully Removed");
    
  })
  menu();
})

};
  
