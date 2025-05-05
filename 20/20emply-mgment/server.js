const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Employee = require('./models/Employee');
const connectDB = require('./config/db')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

// Add new employee
app.post('/add', async (req, res) => {
    const emp = new Employee(req.body);
    await emp.save();
    res.redirect('/');
});

// Get all employees
app.get('/employees', async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
});

// Update employee
app.post('/update/:id', async (req, res) => {
    await Employee.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
});

// Delete employee
app.get('/delete/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Start server
app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
