INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 800000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 1200000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Freddie', 'Freeman', 1, 1),
    ('Mookie', 'Betts', 2, NULL),
    ('Will', 'Smith', 3, 2),
    ('Clayton', 'Kershaw', 4, NULL),
    ('Julio', 'Urias', 5, 3),
    ('Justin', 'Turner', 6, NULL),
    ('Sandy', 'Koufax', 7, 4),
    ('Orel', 'Hershiser', 8, NULL);