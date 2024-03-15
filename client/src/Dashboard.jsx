import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentTable from './components/StudentTable';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import SetTable from './components/SetTable';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Container, Grid, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import Header from './components/Header';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';




export const Dropdown = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [openUnassigned, setOpenUnassigned] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [student, setStudents] = useState([]);
  const [mentor, setMentor] = useState([]);
  const [OnScreenStudent, setOnScreenStudent] = useState([]);
  const [submitSuccessful, setSubmitSuccessful] = useState(false);


  const updateStudentMarks = (studentId, marks) => {
    setOnScreenStudent(prevStudents => prevStudents.map(student => {
      if (student._id === studentId) {
        return { ...student, marks };
      } else {
        return student;
      }
    }));
  };

  const handleOpenUnassigned = () => {
    setOpenUnassigned(true);
  };

  const handleCloseUnassigned = () => {
    setOpenUnassigned(false);
  };


  const getStudent = async () => {
    const response = await axios.get('https://dashboard-qye7.onrender.com/student/getStudent');
    //console.log(response.data);
    setStudents(response.data);
  }

  const getMentor = async () => {
    const response = await axios.get('https://dashboard-qye7.onrender.com/mentor');
    //console.log(response.data);
    setMentor(response.data);
  }

  useEffect(() => {
    getStudent();
    getMentor();
  }, []);

  const updateStudentList = (studentId) => {
    setOnScreenStudent(prevStudents => prevStudents.filter(student => student._id !== studentId));
  };

  const handleLockedStudent = () => {
    navigate(`/finalList/${selectedMentor._id}`);
  };


  const handleStudentChange = (event) => {
    const selectedStudentName = event.target.value;
    setSelectedStudent(selectedStudentName);

    const selectedStudentObject = student.find(student => student.name === selectedStudentName);
    setOnScreenStudent(prevStudents => [...prevStudents, selectedStudentObject]);

    const updatedStudents = student.filter(student => student.name !== selectedStudentName);
    setStudents(updatedStudents);
    setSubmitSuccessful(false);
  };

  const handleMentorChange = async (event) => {
    const selectedMentorName = event.target.value;
    const selectedMentorObject = mentor.find(mentor => mentor.name === selectedMentorName);
    setSelectedMentor(selectedMentorObject);
    setSubmitSuccessful(false);
    const res = await axios.get(`https://dashboard-qye7.onrender.com/mentor/listStudents/${selectedMentorObject._id}`);
    console.log(res.data.students);
    setOnScreenStudent(res.data.students);

  }

  const handleSubmit = async () => {
    if (OnScreenStudent.length >= 3 && OnScreenStudent.length <= 4) {
      setSubmitSuccessful(true);
      //alert(`Mentor: ${selectedMentor}, Students: ${OnScreenStudent.join(', ')}`);
      const response = await axios.patch('https://dashboard-qye7.onrender.com/student/assign', {
        students: OnScreenStudent,
        mentor: selectedMentor
      })
      //console.log(response.data);
    } else {
      alert('Please select between 3 and 4 students');
      //<Alert severity="warning">Please select between 3 and 4 students</Alert>
    }

  };

  const handleRemove = async (id) => {
    const student = OnScreenStudent.find(student => student._id === id);
    setStudents(prevStudents => [...prevStudents, student]);
    const response = await axios.post('https://dashboard-qye7.onrender.com/student/removeAssigned', {
      studentId: id,
      mentorId: selectedMentor._id
    });
    console.log(response.data.updatedMentor);
    setSelectedMentor(response.data.updatedMentor);
    setOnScreenStudent(OnScreenStudent.filter(student => student._id !== id));
    setSubmitSuccessful(false);
  };



  return (
    <>
      <Header />
      <Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Box boxShadow={4} m={2} p={1}>
            <Typography variant="h6" align="center" gutterBottom>
              Please Select a Mentor
            </Typography>
            <Box display="flex" justifyContent="center">
              <FormControl sx={{ m: 2, minWidth: 220 }}>
                <InputLabel id="demo-simple-select-label">Select Mentor</InputLabel>
                <Select label="Select Mentor" labelId="demo-simple-select-label" value={selectedMentor?.name} onChange={handleMentorChange}>
                  {mentor.map((mentor) => (
                    <MenuItem key={mentor._id} value={mentor.name}>
                      {mentor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {selectedMentor!='' && <Typography variant="h6" align="center" gutterBottom>
              Mentor: {selectedMentor?.name}
            </Typography>}
            <Grid container spacing={2} direction={window.innerWidth > 600 ? "row" : "column"} justifyContent="center">
              {selectedMentor != '' &&
                <Grid item>
                  <Box m={1}>
                    <Button variant="contained" color="primary" onClick={handleLockedStudent} disabled={selectedMentor == ''}>
                      Locked Students
                    </Button>
                  </Box>
                
                </Grid>
              }

              {selectedMentor != '' &&
                <Grid item>
                  <Box m={1}>
                    <Button variant="contained" color="error" onClick={handleOpenUnassigned} disabled={selectedMentor == ''}>
                      Unassigned Students
                    </Button>
                  </Box>
                </Grid>
              }
              
            </Grid>
            </Box>
          </Grid>

          {selectedMentor!='' &&
          
          <Grid item xs={12} sm={6}>
            <Box sx={{boxShadow: 3 , m:2}}>
            <Typography variant="h6" align="center" gutterBottom>
              Please Select a Student
            </Typography>
            <Box display="flex" justifyContent="center">
              <FormControl sx={{ m: 2, minWidth: 220 }}>
                <InputLabel id="demo-simple-select-label">Select Student</InputLabel>
                <Select label="Select Student" labelId="demo-simple-select-label" value={selectedStudent} onChange={handleStudentChange} disabled={OnScreenStudent.length >= 4 || selectedMentor == ''}>
                  {student.map((student) => (
                    <MenuItem key={student._id} value={student.name}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Typography variant="h6" align="center" gutterBottom>
              Students Selected
            </Typography>
            <List>
              {OnScreenStudent.map((student) => (
                <Box sx={{boxShadow: 1}}>
                <ListItem key={student._id}>
                  <ListItemText primary={student.name} />
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(student._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                </Box>
              ))}
            </List>
            <Box display="flex" justifyContent="center" m={1} p={1}>
              <Button variant="contained" color="success" onClick={handleSubmit} disabled={OnScreenStudent.length < 3 || OnScreenStudent.length > 4 || selectedMentor.name == undefined}>
                Save
              </Button>
            </Box>
            </Box>
          </Grid>
          }

        </Grid>


        {submitSuccessful && 
        <Box sx={{boxShadow:5 , m:2}}>
          <StudentTable StudentList={OnScreenStudent}
          updateStudentMarks={updateStudentMarks}
          updateStudentList={updateStudentList}
          selectedMentor={selectedMentor}
          totalStudents={student.length}
        />
        </Box>}


        <Dialog open={openUnassigned} onClose={handleCloseUnassigned}>
          <DialogTitle>
            Unassigned Students
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseUnassigned}
              aria-label="close"
              sx={{ position: 'absolute', right: 30, top: 7 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <SetTable StudentList={student} />
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default Dropdown;