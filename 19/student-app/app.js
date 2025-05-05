// npm init -y
// npm install express mongoose ejs
const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/student', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(express.json());

// Insert Array of Students
app.get('/insert', async (req, res) => {
  const students = [
    { Name: "ABC", Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_marks: 25 },
    { Name: "XYZ", Roll_No: 112, WAD_Marks: 22, CC_Marks: 28, DSBDA_Marks: 30, CNS_Marks: 24, AI_marks: 29 },
    { Name: "DEF", Roll_No: 113, WAD_Marks: 18, CC_Marks: 20, DSBDA_Marks: 19, CNS_Marks: 30, AI_marks: 20 },
  ];
  await Student.insertMany(students);
  res.send("Students inserted.");
});

// Display total count and all documents
app.get('/all', async (req, res) => {
  const count = await Student.countDocuments();
  const students = await Student.find();
  res.send(`Total students: ${count}<br>${JSON.stringify(students, null, 2)}`);
});

// Students with DSBDA > 20
app.get('/dsbda-more-than-20', async (req, res) => {
  const students = await Student.find({ DSBDA_Marks: { $gt: 20 } }, { Name: 1, _id: 0 });
  res.send(students);
});

// Update marks by 10 (example for Roll_No = 111)
app.get('/update/:roll', async (req, res) => {
  const roll = parseInt(req.params.roll);
  const student = await Student.findOne({ Roll_No: roll });
  if (student) {
    student.WAD_Marks += 10;
    student.CC_Marks += 10;
    student.DSBDA_Marks += 10;
    student.CNS_Marks += 10;
    student.AI_marks += 10;
    await student.save();
    res.send("Marks updated.");
  } else {
    res.send("Student not found.");
  }
});

// Students with all subjects > 25
app.get('/all-subjects-more-than-25', async (req, res) => {
  const students = await Student.find({
    WAD_Marks: { $gt: 25 },
    CC_Marks: { $gt: 25 },
    DSBDA_Marks: { $gt: 25 },
    CNS_Marks: { $gt: 25 },
    AI_marks: { $gt: 25 }
  }, { Name: 1, _id: 0 });
  res.send(students);
});

// Less than 40 in both WAD and CNS
app.get('/less-than-40', async (req, res) => {
  const students = await Student.find({
    WAD_Marks: { $lt: 40 },
    CNS_Marks: { $lt: 40 }
  }, { Name: 1, _id: 0 });
  res.send(students);
});

// Remove student by roll number
app.get('/delete/:roll', async (req, res) => {
  const roll = parseInt(req.params.roll);
  await Student.deleteOne({ Roll_No: roll });
  res.send(`Deleted student with Roll_No: ${roll}`);
});

// Display table in browser
app.get('/display', async (req, res) => { //http://localhost:3000/display
  const students = await Student.find();
  res.render('students', { students });
});

app.listen(3000, () => console.log("Server started on http://localhost:3000"));
