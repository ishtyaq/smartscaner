const TeachableMachine = require("@sashido/teachablemachine-node");
const ocrSpaceApi2 = require('ocr-space-api-alt2')

let net;
const URL =  'https://teachablemachine.withgoogle.com/models/dfNBM-C8y/';
let   labelContainer, maxPredictions;
let fileData;
let firstResult;


async function detectApp() {
 // $('#progressbar').show();
  console.log('Loading mobilenet..');

  // Load the model.
 // net = await mobilenet.load();
    console.log('Successfully loaded model');
  //$('#prediction-list').append('Model Loaded');

  // custom model
  const modelURL = URL + "/mymodel/model.json";
  const metadataURL = URL + "/mymodel/metadata.json";

   
  console.log('finished loading detectApp..')
  //console.log(result);
}


 

// run the webcam image through the image model
function predict(fileData, requestUrl) {
    let model;
    try{
      model = new TeachableMachine({
        modelUrl: URL
      });
    }
    catch(e){
      return null;
    }
   
    console.log('inside predict');
    return model.classify({
      imageUrl:   requestUrl   + fileData,
    }).then((predictions) => {
     // console.log("Predictions:", JSON.stringify(predictions));
      return predictions;
    }).catch((e) => {
      console.log("ERROR", e);
    });
    
}
exports.start_process = async function startProcess(fileData, requestUrl, res){
//  $('#progressbar').show();
console.log(requestUrl);
  const modelURL = requestUrl + "/mymodel/model.json";
  const metadataURL = requestUrl + "/mymodel/metadata.json";

  console.log('startProcess..');
  //$("#prediction-list").empty();
  // let predictionResult =  await predict(fileData, requestUrl);
   
  let predictionResult =  await predict(fileData, requestUrl);
    let ocrresult = await OCRSpaceScan(fileData);
    //[0]["TextOverlay"], ocrparsedtext:ocrresult[0]["ParsedText"]
    let index=0, matched=0;
    let prediction=null;
    if(predictionResult!=null){
      for (let i = 0; i < predictionResult.length; i++) {
        if(i==0){
          matched = predictionResult[i].probability;
        }
        else if(matched < predictionResult[i].probability ){
          matched = predictionResult[i].probability;
          index = i;
        }
      }
      prediction = predictionResult[index];
    }
    
    console.log(ocrresult);
      var scanresult = { predictions: prediction, ocr: ocrresult[0]["TextOverlay"] };
    //res.send(`loaded ${JSON.stringify(scanresult)}`);
    res.status(200).send({
        ok: true,
        result: scanresult
    });
 
  console.log('End Process..');
 
}
 
function OCRSpaceScan(imageFilePath)
{
  // Image file to upload
 // const imageFilePath = `${__dirname}/loveText.jpg`
 console.log(imageFilePath.split('.'));
  var options =  { 
    apiKey  : 'af3ece4fef88957',
    filetype: imageFilePath.split('.')[1],
    verbose : true,
    language: 'ara',
    OCREngine:1,
    isOverlayRequired:true
  }
  // Run and wait the result
  const getText = async () => {
    try {
      let parsedResults = await ocrSpaceApi2(imageFilePath, options)
      if (parsedResults != null)
      {
         // console.log('Result' + parsedResults);
        // console.log(ParsedResults['ParsedResults']);
         // console.log(parsedResults["ParsedText"]);
          
          /* $.each(parsedResults, function (index, value)
          {
              var exitCode = value["FileParseExitCode"];
              var parsedText = value["ParsedText"];
              var errorMessage = value["ParsedTextFileName"];
              var errorDetails = value["ErrorDetails"];

              var textOverlay = value["TextOverlay"];
              var pageText = '';
              console.log(textOverlay);
              // $("#result-list").append(parsedText);
            //  $("#prediction-list").append('<li><b>Text:</b>' + parsedText + '</li>');
              console.log('<li><b>Text:</b>' + parsedText + '</li>');
          }); */
      }
      let data1 = parsedResults["data"];
      
    //  console.log(data1);
     // console.log(data1["ParsedResults"]);
    // console.log(data1["ParsedResults"]);
     let ParsedResults = data1["ParsedResults"];
        
       console.log(ParsedResults[0]["TextOverlay"]);
       return ParsedResults;
    } catch (error) {
      console.error(error)
    }
  }

  return getText();
}


detectApp();