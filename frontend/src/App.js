import React from 'react';
import Attendance from './Components/Attendance/Attendance.js';
import Home from "./Components/Home/Home.js"
import {ToastContainer,  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {


  return (
    <div className="App">
      <ToastContainer />
      <Home toast={toast}/>
    </div>

  );
}

export default App;
