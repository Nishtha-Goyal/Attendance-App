export const  fetchData =async (id,callback)=>{
    fetch(`http://localhost:5000/showAttendance/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      method: "GET",
      credentials: "include",
      
    })
    .then((res) => res.json())
    .then((res) => {
    //   return res;
        callback(res);
    });
  }

 export const mark =(image_url,callback)=>{
    fetch(`http://localhost:5000/mark`, {
        body:JSON.stringify({
           image_url:image_url
         }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      method: "POST",
      credentials: "include",
      
    })
    .then((res) => res.json())
    .then((res) => {
      callback(res)
    });
  }
  