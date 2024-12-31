const express = require('express');
// const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors'); // Import the CORS package
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use('/uploads', express.static('uploads')); // Serve files from the uploads directory
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory


// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '#RAHULRANA12345',
  database: 'teacher_notes',
  port: 3306 // Add this line if using a different port
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID:', connection.threadId);
});
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

// Create an API endpoint for uploading notes
app.post('/upload-note', upload.single('note'), (req, res) => {
  const teacherName = req.body.teacher_name; // Get teacher name from the request
  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`; // Create full URL

  // Save to database
  const query = 'INSERT INTO teacher_notes (teacher_name, file_url) VALUES (?, ?)';
  connection.query(query, [teacherName, fileUrl], (err, results) => {
    if (err) {
      return res.status(500).send('Error saving note to database');
    }
    res.send('Note uploaded successfully');
  });
});



// Create an API endpoint for fetching notes
app.get('/fetch-notes', (req, res) => {
  const { teacher_name, keyword } = req.query; // Get teacher name and keyword from query parameters

  // Build the query
  let query = 'SELECT * FROM teacher_notes WHERE teacher_name = ?';
  let queryParams = [teacher_name];

  if (keyword) {
    query += ' AND file_url LIKE ?'; // Add keyword filter
    queryParams.push(`%${keyword}%`); // Use wildcard for partial matching
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send('Error fetching notes from database');
    }
    res.json(results); // Send the results as JSON
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});