import express from 'express';

import {evaluate,updateMarks} from '../controller/evaluations.js'
const router = express.Router();
router.post('/',evaluate);

router.patch('/:studentId',updateMarks);

export default router;