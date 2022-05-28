import React from "react";
import Webcam from "react-webcam";
import "./Attendance.css";
import {mark} from "../Api/Api.js"


const videoConstraints = {
    width: 280,
    height: 400,
    facingMode: "user"
  };
  
  const Attendance = ({toast,setData,setClick}) => {
    
    const webcamRef = React.useRef(null);

    const postDetails = (img) =>{
        const data = new FormData()
           data.append("file",img)
           data.append("upload_preset","attendance-app")
           data.append("cloud_name","visheshg")
           fetch("https://api.cloudinary.com/v1_1/visheshg/image/upload",{
             method:"post",
             body:data
           })
           .then(res =>res.json())
           .then(data=>{
            mark(data.url,(res=>{

              console.log(res)
                if(res.message==="err")
                {
                    toast.error("Please Try Again", {autoClose:3000})
                    document.getElementById("button").innerHTML="capture"
                }
                else if(res.message=="none")
                {
                    toast.error("No Face Detected", {autoClose:3000})
                    document.getElementById("button").innerHTML="capture"
                }
                else if(res.message=="Already Marked")
                {
                  toast.info("Already Marked", {autoClose:3000})
                    document.getElementById("button").innerHTML="capture"
                }
                else{
                    toast.success("Attendance Marked", {autoClose:3000})
                    document.getElementById("button").innerHTML="capture"
                }
                setClick(false);
            }))
           })
           .catch(err =>{console.log(err)})
      }
    
    const capture = React.useCallback(
      () => {
        document.getElementById("button").innerHTML="Marking Attendance"
        const imageSrc = webcamRef.current.getScreenshot();
        postDetails(imageSrc)
        
      },
      [webcamRef]
    );
    return (
      <div className="Attendance-head">
        <div>
        <Webcam className="cam"
          audio={false}
          height={400}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={280}
          screenshotQuality={1}
          videoConstraints={videoConstraints}
        />
        </div>
        <div >
        <button onClick={capture} className="click-pic" id="button">Capture</button>
        </div>
      </div>
    );
  };
  export default Attendance;