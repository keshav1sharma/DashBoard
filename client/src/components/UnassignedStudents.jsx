import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function createData(rollNo, name, ideation, execution, viva, totalMarks) {
    return { rollNo, name, ideation, execution, viva, totalMarks };
}

const FinalList = () => {
    const { mentorId } = useParams();
    const [studentList, setStudentList] = useState([]);
    const [showButton, setShowButton] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const handlePrint = async () => {
        await setShowButton(false);
        window.print();
        setShowButton(true);
    };

    const handleSendMail = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/student/sendEmail`, {
                students: studentList
            });
            console.log(response.data);
            if (response.status == 200) {
                setOpenDialog(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    useEffect(() => {
        // Function to fetch the final list of students
        const fetchFinalList = async (mentorId) => {
            try {
                const response = await axios.get(`http://localhost:3001/student/getFinalStudents/${mentorId}`);
                return response.data.students;
            } catch (error) {
                console.error('Error fetching final list:', error);
                return [];
            }
        };

        // Example usage of fetchFinalList
        fetchFinalList(mentorId)
            .then((students) => {
                console.log('Final list of students:', students);
                setStudentList(students);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const rows = studentList.map((student) => {
        return createData(
            student.rollNo,
            student.name,
            student.marks.ideation,
            student.marks.execution,
            student.marks.viva,
            student.totalMarks
        );
    });

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Roll No</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="right">Ideation</TableCell>
                            <TableCell align="right">Execution</TableCell>
                            <TableCell align="right">Viva</TableCell>
                            <TableCell align="right">Total Marks</TableCell>
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
                                <TableCell align="right">{row.ideation}</TableCell>
                                <TableCell align="right">{row.execution}</TableCell>
                                <TableCell align="right">{row.viva}</TableCell>
                                <TableCell align="right">{row.totalMarks}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {showButton && <Button variant="contained" color="primary" onClick={handlePrint}>
                Print
            </Button>}
            {showButton && <Button variant="contained" id='emailButton' color="secondary" onClick={handleSendMail}>
                Send Email
            </Button>}


            
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <CheckCircleIcon color="success" /> Email Sent
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Emails have been sent successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FinalList;