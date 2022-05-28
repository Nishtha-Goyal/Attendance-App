'use strict';

const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");


key=process.env.KEY1
endpoint=process.env.ENDPOINT

const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new Face.FaceClient(credentials, endpoint);


 const images_path = "";
 const person_group_id = process.env.GROUP_ID

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





async function AddFacesToPersonGroup(person_dictionary, person_group_id) {
    console.log ("Adding faces to person group...");
    
    await Promise.all (Object.keys(person_dictionary).map (async function (key) {
        const value = person_dictionary[key];
        await sleep (2000);

        let person = await client.personGroupPerson.create(person_group_id, { name : key });
        console.log("Create a persongroup person: " + key + ".");
        await Promise.all (value.map (async function (similar_image) {
            let sufficientQuality = true;
            let detected_faces = await client.face.detectWithUrl(similar_image,
                {
                    returnFaceAttributes: ["QualityForRecognition"],
                    detectionModel: "detection_03",
                    recognitionModel: "recognition_03"
                });
            detected_faces.forEach(detected_face => {
                if (detected_face.faceAttributes.qualityForRecognition != 'high'){
                    sufficientQuality = false;
                }
            });

                console.log("Add face to the person group person: (" + key + ") from image: " + similar_image + ".");
                await client.personGroupPerson.addFaceFromUrl(person_group_id, person.personId,similar_image);
           
        }));
    }));

    console.log ("Done adding faces to person group.");
}

async function WaitForPersonGroupTraining(person_group_id) {
    // Wait so we do not exceed rate limits.
    console.log ("Waiting 10 seconds...");
    await sleep (10000);
    let result = await client.personGroup.getTrainingStatus(person_group_id);
    console.log("Training status: " + result.status + ".");
    if (result.status !== "succeeded") {
        await WaitForPersonGroupTraining(person_group_id);
    }
}

/* NOTE This function might not work with the free tier of the Face service
because it might exceed the rate limits. If that happens, try inserting calls
to sleep() between calls to the Face service.
*/
async function IdentifyInPersonGroup() {
    console.log("========IDENTIFY FACES========");
    console.log();

// Create a dictionary for all your images, grouping similar ones under the same key.
    const person_dictionary = {
        "1" : ["https://res.cloudinary.com/visheshg/image/upload/v1652820118/Images/vishesh2_pipcni.jpg", "https://res.cloudinary.com/visheshg/image/upload/v1652820117/Images/vishesh1_wqlojz.jpg"],
        "2" : ["https://res.cloudinary.com/visheshg/image/upload/v1653739194/Images/nishtha1_kpqhnu.jpg", "https://res.cloudinary.com/visheshg/image/upload/v1653739757/Images/nishtha2_zmjpws.jpg"],
        "3" : ["https://res.cloudinary.com/visheshg/image/upload/v1652820116/Images/aakash2_gpr9qr.jpg","https://res.cloudinary.com/visheshg/image/upload/v1652820116/Images/aakash1_xj8hhq.jpg"],
    };

    // A group photo that includes some of the persons you seek to identify from your dictionary.
    let source_image_file_name = "identification1.jpg";
    // Create a person group. 
    console.log("Creating a person group with ID: " + person_group_id);
   // await client.personGroup.create(person_group_id, person_group_id, {recognitionModel : "recognition_04" });

    await AddFacesToPersonGroup(person_dictionary, person_group_id);

    // Start to train the person group.
    console.log();
    console.log("Training person group: " + person_group_id + ".");
    await client.personGroup.train(person_group_id);

    await WaitForPersonGroupTraining(person_group_id);
    console.log();







    // // Detect faces from source image url and only take those with sufficient quality for recognition.
    // let face_ids = (await DetectFaceRecognize(image_base_url + source_image_file_name)).map (face => face.faceId);
    // // Identify the faces in a person group.
    // let results = await client.face.identify(face_ids, { personGroupId : person_group_id});
    // await Promise.all (results.map (async function (result) {
    //     let person = await client.personGroupPerson.get(person_group_id, result.candidates[0].personId);
    //     console.log("Person: " + person.name + " is identified for face in: " + source_image_file_name + " with ID: " + result.faceId + ". Confidence: " + result.candidates[0].confidence + ".");
    // }));
    // console.log();
}

async function main() {
    await IdentifyInPersonGroup();
    console.log ("Done.");
}
main();