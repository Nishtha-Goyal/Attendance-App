const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const express=require('express');


key=process.env.KEY1
endpoint=process.env.ENDPOINT
const person_group_id = process.env.GROUP_ID

const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new Face.FaceClient(credentials, endpoint);


  async function DetectFaceRecognize(url) {
    // Detect faces from image URL. Since only recognizing, use the recognition model 4.
    // We use detection model 3 because we are only retrieving the qualityForRecognition attribute.
    // Result faces with quality for recognition lower than "medium" are filtered out.
    let detected_faces = await client.face.detectWithUrl(url,
        {
            detectionModel: "detection_03",
            recognitionModel: "recognition_04",
            returnFaceAttributes: ["QualityForRecognition"]
        });
    return detected_faces.filter(face => face.faceAttributes.qualityForRecognition == 'high' || face.faceAttributes.qualityForRecognition == 'medium');
}

//Detect faces from source image url and only take those with sufficient quality for recognition.
    async function detect(url){
    let face_ids = (await DetectFaceRecognize(url)).map (face => face.faceId);
    // Identify the faces in a person group.
    if(face_ids.length===0)return -1;
    let results = await client.face.identify(face_ids, { personGroupId : person_group_id});
    console.log("results",results)
   // await Promise.all (results.map (async function (result) {
        let person = await client.personGroupPerson.get(person_group_id, results[0].candidates[0].personId);
       return person.name;
    //}));
    
}
module.exports={detect}
