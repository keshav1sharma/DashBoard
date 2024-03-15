import express from 'express';
import Mentor from '../models/Mentor.js';
import {getStudentInList} from '../controller/getStudents.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.status(200).json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

router.get('/listStudents/:mentorId',getStudentInList);


export default router;