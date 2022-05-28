const express=require('express');
const router=express.Router();
const User=require('../modals/User');
require("dotenv").config()
const {detect}=require("../services/detect_face.js")
const getDate=()=>{
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}
router.post('/mark', async(req,res)=>{
    console.log(req.body.image_url)
     let id=  await detect(req.body.image_url)
     console.log("a",id)
     if(id==-1)
     {
         res.status(404).json({message:"none"})
         
     }
    else{
     User.find({Emp_id:id},(err,users)=>{
        if(err){
            res.status(500).json({
                message:"err"
            })
        }
        else{
          var date=getDate(); 
          
          const user=users[0];
          let c=0
          user.attendance.map(data=>{if(data.date==date){c=1}})
          if(c===1)
          {
            res.status(200).json({
                message:"Already Marked"
            })
          }
         else{

          user.attendance.push({"date":date,"status":"present"});
            user.save((err,user)=>{
                if(err){
                    res.status(500).json({
                        message:"err"
                    })
                }
                else{
                   
                    res.status(200).json({
                        message:"Attendance Marked"
                    })
                }
            })
        }
    }
    
    })
}
})
router.post("/add",(req,res)=>{
    console.log("q",req.body)
    const user=new User({
        "name":req.body.name,
        "Emp_id":req.body.Emp_id,
        "attendance":[]
    })
    user.save((err,user)=>{
        if(err){
            res.status(500).json({
                error:"err"
            })
        }
        else{
            res.status(200).json({
                message:"User Added"
            })
        }
    })
})
router.get('/showAttendance/:id',(req,res)=>{
    console.log(req.params.id)
   User.find({Emp_id:req.params.id},(err,data)=>{
       if(err){
           console.log(err)
           res.send({"data":[]})
       }
       else{
           res.send({"data":data})
       }
   })
})
module.exports=router;