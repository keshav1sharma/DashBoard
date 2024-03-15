import Student from '../models/Student.js';

// Corrected export statement
export const evaluate = async (req, res) => {
    try {
        const { studentId, marks } = req.body;
        const { ideation, execution, viva } = marks;
        const ideationInt = parseInt(ideation, 10);
        const executionInt = parseInt(execution, 10);
        const vivaInt = parseInt(viva, 10);

        const totalMarks = ideationInt + executionInt + vivaInt;
        const student = await Student.findById(studentId);
        student.marks = { ideation, execution, viva };
        student.totalMarks = totalMarks;
        await student.save();
        res.status(200).json({ student });

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

export const updateMarks =  async(req,res)=>{
    try{
        const { marks } = req.body;
        const { ideation, execution, viva } = marks;
        const { studentId } = req.params;
        const ideationInt = parseInt(ideation, 10);
        const executionInt = parseInt(execution, 10);
        const vivaInt = parseInt(viva, 10);

        const updateMarks = ideationInt + executionInt + vivaInt;

        const student = await Student.findByIdAndUpdate(studentId, {
            marks: { ideation, execution, viva},
            totalMarks : updateMarks,
            isEvaluated : true
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({student});

    }catch(error){
        res.status(500).json({message : "server error"});
    }
}
