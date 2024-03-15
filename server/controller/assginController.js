import Student from '../models/Student.js';
import Mentor from '../models/Mentor.js';

export const assign = async (req, res) => {
    try {
        const { students, mentor } = req.body;
        console.log(students);
        console.log(mentor);

        const updatedStudents = await Promise.all(students.map(async (studentData) => {
            const student = await Student.findByIdAndUpdate(studentData._id, {
                isAssigned: true,
                mentorEmail: mentor.email 
            }, { new: true });
            await student.save();
            return student;
            
        }));

        const updatedMentor = await Mentor.findByIdAndUpdate(mentor._id, {
            $addToSet: { students: { $each: updatedStudents.map(student => student._id) } }
        }, { new: true });
        await updatedMentor.save();


        res.status(200).json({ updatedMentor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const removeAssigned = async (req, res) => {
    try {
        const { studentId, mentorId } = req.body;
        console.log(studentId);
        console.log(mentorId);

        const student = await Student.findByIdAndUpdate(studentId, {
            isAssigned: false,
            mentorEmail: ''
        }, { new: true });
        await student.save();

        const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, {
            $pull: { students: studentId }
        }, { new: true });
        await updatedMentor.save();
        res.status(200).json({ updatedMentor });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}