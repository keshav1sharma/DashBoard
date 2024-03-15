import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAssigned: {
    type: Boolean,
    default: false
  },
  mentorEmail: {
    type: String,
    default :""
  },
  isEvaluated: {
    type: Boolean,
    default: false
  },
  isFinal: {
    type: Boolean,
    default: false
  },
  marks: {
    ideation: {
      type: Number,
      default: 0
    },
    execution: {
      type: Number,
      default: 0
    },
    viva: {
      type: Number,
      default: 0
    }
  },
  totalMarks: {
    type: Number,
    default: 0
  }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;