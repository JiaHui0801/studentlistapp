const express = require('express'); 
const mysql = require('mysql2');
const app = express();

// Create MySQL connection 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RP738964$',
  database: 'c237_studentlistapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set up view engine 
app.set('view engine', 'ejs');

// Enable static files 
app.use(express.static('public'));

// Enable Form Processing for POST Requests
app.use(express.urlencoded({ extended: false }));

// Home Page
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM student';

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error retrieving students');
    }

    res.render('index', { products: results });
  });
});

// Display Student Details
app.get('/product/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = 'SELECT * FROM student WHERE studentId = ?';

  connection.query(sql, [studentId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error retrieving student by ID');
    }

    if (results.length > 0) {
      res.render('product', { product: results[0] });
    } else {
      res.send('Student not found');
    }
  });
});

// Add Student Page
app.get('/addStudent', (req, res) => {
  res.render('addStudent');
});

// Add Student
app.post('/addStudent', (req, res) => {
  const { name, dob, contact, image } = req.body;

  const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?, ?, ?, ?)';

  connection.query(sql, [name, dob, contact, image], (error, results) => {
    if (error) {
      console.error("Error adding student:", error);
      res.send('Error adding student');
    } else {
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));