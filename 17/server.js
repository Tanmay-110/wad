const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from 'public'
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname)));

// API endpoint to serve employee data
app.get('/api/employees', (req, res) => {
  const filePath = path.join(__dirname, 'employees.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading employees.json:', err);
      return res.status(500).json({ error: 'Failed to load employee data' });
    }
    res.json(JSON.parse(data));
  });
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

app.listen(PORT, () => {
  console.log(`Employee Directory running at http://localhost:${PORT}`);
});
