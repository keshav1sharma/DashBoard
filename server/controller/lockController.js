
import Student from '../models/Student.js';
import Mentor from '../models/Mentor.js';

export const lockedStudent = async(req,res)=>{
    try{
        const {studentId} = req.params;
        const {mentorId} = req.body;
        console.log(req.body.mentorId);

        const student = await Student.findById(studentId);
        if(!student){
            return res.status(404).json({message: "student not found"});
        }

        const mentor = await Mentor.findById(mentorId);
        if(!mentor){
            return res.status(404).json({message: "mentor not found"});
        }

        if (mentor.email !== student.mentorEmail) {
            return res.status(403).json({ message: "Mentor email does not match" });
        }

        if(student.isEvaluated == false)
        {
            return res.status(402).json({message: "Student is not yet Evaluated, Please evaluate the student first! "});
        }

        student.isFinal = true;
        await student.save();
        res.status(200).json({message : "student is locked"});
    }

    catch(error){
        console.log(error);
    }
}