import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import axios from 'axios';

function createData(rollNo, name, totalMarks, student) {
  return { rollNo, name, totalMarks, student };
}

export default function StudentTable(props) {

  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [ideation, setIdeation] = useState(0);
  const [execution, setExecution] = useState(0);
  const [viva, setViva] = useState(0);


  const handleEdit = (student) => {
    setCurrentStudent(student);
    // Set the initial values for the editable fields
    setIdeation(student.marks.ideation);
    setExecution(student.marks.execution);
    setViva(student.marks.viva);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Perform your action here
    if (ideation > 100 || ideation < 0 || execution > 100 || execution < 0 || viva > 100 || viva < 0) {
      alert('Marks should be between 0 and 100');
      //<Alert severity="warning">Marks should be between 0 and 100</Alert>
      return;
    }
    const marks = { ideation, execution, viva };
    console.log('Save', { ideation, execution, viva });
    currentStudent.totalMarks = parseInt(ideation) + parseInt(execution) + parseInt(viva);
    currentStudent.marks.ideation = ideation;
    currentStudent.marks.execution = execution;
    currentStudent.marks.viva = viva;

    const response = axios.patch(`https://dashboard-qye7.onrender.com/evaluations/${currentStudent._id}`, {
      studentId: currentStudent._id,
      marks,
    });
    console.log(response);
    props.updateStudentMarks(currentStudent._id, marks);
    handleClose();
  };

  //console.log('StudentList', props.StudentList);
  const rows = props.StudentList.map((student) => {
    return createData(student.rollNo, student.name, student.totalMarks, student);
  });

  const handleConfirm = async (student) => {
    setOpenConfirm(false);
    // Check if the student has been evaluated
    // if (!student.isEvaluated) {
    //   alert("Student is not yet Evaluated, Please evaluate the student first!");
    //   return;
    // }
    // Send PATCH request to server
    try{
    const response = await axios.patch(`https://dashboard-qye7.onrender.com/student/${student._id}/lock`, {
      mentorId: props.selectedMentor._id
    });
    console.log(response.status, response.data.message);
    if(response.status == 200)
    {
      props.updateStudentList(student._id);
      return;
    }
  }
  catch(error){
      if(error.response.status == 402)
      {
        alert(error.response.data.message);
      }
      if(error.response.status == 403)
      {
        alert(error.response.data.message);
      }
  }
  };
  
  const handleSubmit = (student) => {
    if (props.StudentList.length === 4 || (props.StudentList.length<4 && props.totalStudents == 0)) {
      setCurrentStudent(student);
      setOpenConfirm(true);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='left'>RollNo</TableCell>
              <TableCell align='left'>Name</TableCell>
              <TableCell align="right">Marks</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.rollNo}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="right">{row.totalMarks}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="primary" onClick={() => handleEdit(row.student)}>
                    Edit
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="secondary" onClick={() => handleSubmit(row.student)} disabled={props.StudentList.length !== 4 && props.totalStudents !=0}>
                    Lock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentStudent?.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Idea"
            type="number"
            fullWidth
            value={ideation}
            onChange={(e) => setIdeation(e.target.value)}
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            margin="dense"
            label="Execution"
            type="number"
            fullWidth
            value={execution}
            onChange={(e) => setExecution(e.target.value)}
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            margin="dense"
            label="Viva"
            type="number"
            fullWidth
            value={viva}
            onChange={(e) => setViva(e.target.value)}
            inputProps={{ min: 0, max: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to lock the field?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">No</Button>
          <Button onClick={() => handleConfirm(currentStudent)} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}