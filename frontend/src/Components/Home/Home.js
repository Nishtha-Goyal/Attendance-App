import React,{useState} from 'react'
import "./Home.css"
import Attendance from '../Attendance/Attendance';
import Dashboard from '../Dashboard/Dashboard';
import alertify from 'alertifyjs';
import {mark,fetchData} from"../Api/Api.js"
 const Home = ({toast}) => {
   const [click,setClick]=useState(false);
   const [user_data,setData]=useState([])
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const d = new Date();
    let month = months[d.getMonth()];
    let day = d.getDate();
    let year = d.getFullYear();
    const promalert= ()=>{
      alertify.prompt("Please enter the Id to proceed!","Id here",(e, id)=>{
        if (e) {
             console.log(id)
            fetchData(id,res=>{
                setData(res.data)
              });
            
        } else {
            alertify.alert("Operation Cancelled!");
        }
    });
    }
    
  return (
    <div className='home-head'>
        <p className='home-head-text'>Welcome to Attendance App</p>
        <p className='home-time-text'>Today's Date: {month} {day}, {year}</p>
        {click===false&& user_data.length==0?<div>
          <div className='home-button' onClick={()=>setClick(true)}><p className='text-button' > Mark Attendance</p></div>
          <div className='home-button'onClick={()=>{promalert()}}> <p className='text-button ' >Check Attendance</p></div>
        </div>:
        user_data.length==0?<Attendance toast={toast} setData={setData}setClick={setClick}/>:
        <Dashboard user={user_data[0]}/>
        }
    </div>
  )
}

export default Home
