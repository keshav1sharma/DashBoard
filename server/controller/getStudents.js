import express from 'express';
import Mentor from '../models/Mentor.js';
import Student from '../models/Student.js';
const router = express.Router();

export const getStudentInList = async (req, res) => {
    try {
        const { mentorId } = req.params;
        console.log(mentorId);
        const mentor = await Mentor.findById(mentorId);

        const data = mentor.students

        const newdata = [];


        for (const studentId of data) {
            const student = await Student.findById(studentId);
            if (student && !student.isFinal) {
                newdata.push(student);
            }
        }

        res.status(200).json({ students: newdata });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

}