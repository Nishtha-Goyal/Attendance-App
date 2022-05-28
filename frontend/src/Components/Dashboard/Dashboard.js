import React,{useState,useEffect} from 'react'
import "./Dashboard.css"
import {VictoryPie} from 'victory-pie'
import moment from 'moment'
export default function Dashboard(props) {
  const data=props.user
  const[no,setno]=useState(30)
  const [attendance,setattendance]=useState([])
  const [ present,set]=useState([])
  
  useEffect(()=>{
    
    let t=new Map()
    for (var i = no-1; i >=0; i--){
      let temp = moment().subtract(i, 'days').format('MM/DD/YYYY')
      console.log(temp)
      t.set(temp,"Absent");
    
    }
    let temp=[]
    data.attendance.map(item=>{
      console.log(item.date)
      if(moment().subtract(no, 'days').calendar()<item.date)
      {
        temp.push(item)
        t.set(item.date,item.status)
      }
    })
    let temp_array=[]
    t.forEach((value,key,map)=>{
      temp_array.push({date:key,status:value})
    })
    set(temp_array);
    setattendance(temp)
  },[no])

  const change=()=>{
    if(no==7)setno(30)
   else setno(7)
  }

  return (
    <div className='dashboard-head' >
      <p>Attendance Report</p>
      <div className='dashboard-top'>
        <div className='dashboard-user'>
          <p className='user'>Name: {data.name}</p>
          <p className='user'>Id: {data.Emp_id}</p>
          <button onClick={()=>change()} className='toggle-button'>See past {37-no} days data</button>
        </div>
        <div className='dashboard-chart'>
          <span>Attendance: {Math.round(attendance.length*100/no*100)/100}%</span>
          <VictoryPie
            colorScale={[ "green", "Red" ]}
              data={[
                {x: "Present", y:attendance.length},
                {x: "Absent", y:no-attendance.length}
            ]}
            radius={50}
            height={160}
            padding={0}
            style={{ labels: { fill: "white", fontSize: 15, fontWeight: "bold" }}}
            animate={{
              duration: 1000
            }}
            />
           <span> Last {no} days data</span>
        </div>
      </div>
      <div className='dashboard-bottom'>
        {present.map(item=>{
          return <div className='dashboard-row' style={{background:item.status=="Absent"?"Red":"Green"}}>
            <div>{item.date}</div>
            </div>
        })}
      </div>
  </div>
  )
}
