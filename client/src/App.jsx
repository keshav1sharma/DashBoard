import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import StudentTable from "./components/StudentTable";
import FinalList from "./components/FinalList";
import Dashboard from "./Dashboard";
import Box from '@mui/material/Box';
import { CssBaseline, Container } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/finalList/:mentorId" element={<FinalList />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
    </BrowserRouter>
  );
}

export default App;