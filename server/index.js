import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Mentor from './models/Mentor.js';
import evaluationRoutes from './routes/evaluationRoutes.js'
import lock from './routes/studentProfile.js';
import mentor from './routes/mentor.js'
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');

    // const Names = [
    //   'Aarav', 'Aanya', 'Advik', 'Ananya', 'Arjun', 'Ishaan', 'Kavya', 'Krishna', 'Mira', 'Neha', 'Rohan', 'Saanvi', 'Shreya', 'Vedika', 'Vihaan'
      
    // ];
    // const students = [];
    // for (let i = 0; i < Names.length; i++) {
    //   const student = new Student({
    //     name: Names[i],
    //     rollNo: `2025${i + 1}`,
    //     email: `${Names[i]}${`2025${i+1}`}@example.com`, 
    //   });
    //   await student.save();
    //   students.push(student);
    // }
    // const mentorNames = [
    //   'Arjun', 'Neha', 'Aarti', 'Raj', 'Priya', 'Ankit', 'Shreya', 'Vikram', 'Kriti', 'Siddharth'
    // ];
    // const mentors = [];
    // for (let i = 0; i < mentorNames.length; i++) {
    //   const mentor = new Mentor({
    //     name: mentorNames[i],
    //     email: `${mentorNames[i]}${i + 1}@example.com`, 
    //     students: []
    //   });
    //   await mentor.save();
    //   mentors.push(mentor);
    // }
    
    app.listen(PORT, () => console.log(`Server Port: ${PORT} && connected to database`));
  })
  .catch((error) => console.log(`${error} did not connect`));
  app.use('/evaluations', evaluationRoutes);
  app.use('/student',lock);
  app.use('/mentor',mentor);