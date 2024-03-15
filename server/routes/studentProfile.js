import express from 'express';
import { assign , removeAssigned } from '../controller/assginController.js';
import {lockedStudent} from "../controller/lockController.js";
import {sendMarkSheet} from "../controller/sendMail.js";
import { getAllStudents,getAssignStudent,getEvaluatedStudent,getFinalList} from '../controller/studentDetails.js';
const router = express.Router();
router.patch('/assign',assign);
router.patch('/:studentId/lock',lockedStudent);
router.get('/getStudent',getAllStudents);
router.get('/mentorAssignStudent',getAssignStudent);
router.get('/mentorEvaluatedStudent',getEvaluatedStudent);
router.get('/getFinalStudents/:mentorId',getFinalList);
router.post('/sendEmail',sendMarkSheet)
router.post('/removeAssigned',removeAssigned);
export default router;
