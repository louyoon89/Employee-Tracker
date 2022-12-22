// require
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

// connection
const connection = mysql.createConnection({
  database: "employee_db",
  user: "root",
  password: "root",
  host: "localhost",
  port: 3306,
});
connection.connect((err) => {
  console.log("Successful Connection");
  if (err) throw err;
  startSearch();
});

// start function
const startSearch = () => {
  inquirer
    .prompt([
      {
        name: "initialsearch",
        type: "rawlist",
        message: "Employee Tracker: What is your objective?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Update An Employee Role",
          "Exit",
        ],
      },
    ])
    // switch choice with new function
    .then((res) => {
      switch (res.initialsearch) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployee();
          break;
        case "Add A Department":
          addDept();
          break;
        case "Add A Role":
          addRole();
          break;
        case "Add An Employee":
          addEmployee();
          break;
        case "Update An Employee Role":
          updateRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
};

// function for each case
// case "View All Departments"
const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    console.table(res);
    if (err) throw err;
    startSearch();
  });
};

// case "View All Roles"
const viewRoles = () => {
  connection.query("select * from role", (err, res) => {
    console.table(res);
    if (err) throw err;
    startSearch();
  });
};

// case "View All Employees"
const viewEmployee = () => {
  connection.query(`SELECT * FROM employee_db.employee`, (err, res) => {
    console.table(res);
    if (err) throw err;
    startSearch();
  });
};

// case "Add A Department"
const addDept = () => {
  inquirer
    .prompt([
      {
        name: "addDepart",
        type: "input",
        message:
          "What is the name of the NEW DEPARMTMENT that you would like to add?",
      },
    ])
    .then((res) => {
      connection.query(
        `INSERT INTO department SET ?`,
        {
          name: res.addDepart,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`\n Department Added! \n`);
          startSearch();
        }
      );
    });
};

// case "Add A Role"
const addRole = () => {
  connection.query(`SELECT * FROM department`, (err, res) => {
    let departments = res.map((department) => ({
      name: department.name,
      value: department.id,
    }));
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Please add a role:",
        },
        {
          name: "salary",
          type: "input",
          message: "This role's salary is:",
        },
        {
          name: "deptName",
          type: "list",
          message: "This role will be added to which department?",
          choices: departments,
        },
      ])
      .then((res) => {
        connection.query(
          `INSERT INTO role SET ?`,
          {
            title: res.title,
            salary: res.salary,
            department_id: res.deptName,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`\n Role Added! \n`);
            startSearch();
          }
        );
      });
  });
};

// case "Add An Employee"
const addEmployee = () => {
  connection.query(`SELECT * FROM role`, (err, res) => {
    let roles = res.map((role) => ({ name: role.title, value: role.id }));
    connection.query(`SELECT * FROM employee`, (err, res) => {
      let employee = res.map((employee) => ({
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      }));
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "What is new employee's first name?",
          },
          {
            name: "lastName",
            type: "input",
            message: "What is new employee's last name?",
          },
          {
            name: "role",
            type: "list",
            message: "What is new employee's title/role?",
            choices: roles,
          },
          {
            name: "manager",
            type: "list",
            message: "Who will be the new employee's manager?",
            choices: employee,
          },
        ])
        .then((res) => {
          connection.query(
            `INSERT INTO employee SET ?`,
            {
              first_name: res.firstName,
              last_name: res.lastName,
              role_id: res.role,
              manager_id: res.manager,
            },
            (err, res) => {
              if (err) throw err;
              console.log(`\n Employee added! \n`);
              startSearch();
            }
          );
        });
    });
  });
};

// case "Update An Employee Role"
const updateRole = () => {
  connection.query(`SELECT * FROM role;`, (err, res) => {
    let roles = res.map((role) => ({ name: role.title, value: role.id }));

    connection.query(`SELECT * FROM employee;`, (err, res) => {
      let employee = res.map((employee) => ({
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      }));

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee's role would you like to update?",
            choices: employee,
          },
          {
            name: "newRole",
            type: "list",
            message: "What is the employee's new role?",
            choices: roles,
          },
        ])

        .then((res) => {
          console.log(res);
          connection.query(
            `UPDATE employee SET role_id = ? WHERE id = ? ;`,
            [res.newRole, res.employee],
            (err, res) => {
              if (err) throw err;
              console.log(`\n Role Updated! \n`);
              startSearch();
            }
          );
        });
    });
  });
};
