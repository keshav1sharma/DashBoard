import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";
// app.get('/getStudent',async (req,res)=>{
//     const data = await Student.find();
//     res.status(200).json(data);
// });

export const getAllStudents = async (req, res) => {
  try {
    const data = await Student.find({ isAssigned: false });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignStudent = async (req, res) => {
  try {
    const { mentorId } = req.body;

    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const studentIds = mentor.students.map((student) => student._id);
    const students = await Student.find({
      _id: { $in: studentIds },
      isAssigned: true,
      isEvaluated: false,
    });

    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEvaluatedStudent = async (req, res) => {
    try {
      const { mentorId } = req.body;
  
      const mentor = await Mentor.findById(mentorId);
  
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
  
      const studentIds = mentor.students.map((student) => student._id);
      const students = await Student.find({
        _id: { $in: studentIds },
        isAssigned: true,
        isEvaluated: true,
        isFinal : false,
      });
  
      res.status(200).json({ students });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const getFinalList = async (req, res) => {
    try {
      const { mentorId } = req.params;

      const mentor = await Mentor.findById(mentorId);
  
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
  
      const studentIds = mentor.students.map((student) => student._id);
      const students = await Student.find({
        _id: { $in: studentIds },
        isAssigned: true,
        isEvaluated: true,
        isFinal : true,
      });
  
      res.status(200).json({ students });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
