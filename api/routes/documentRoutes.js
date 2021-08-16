'use strict';
const path = require("path")
const multer = require('multer');
var fs = require('fs');

module.exports = function(app) {
  var documentCtrl = require('../controllers/documentController');
  var predictObj = require('../controllers/detect');
    // var upload = multer({ dest: "Upload_folder_name" })
    // If you do not want to use diskStorage then uncomment it
        
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            
            // Uploads is the Upload_folder_name
            cb(null, "uploads")
        },
        filename: function (req, file, cb) {
           // console.log(req.files);
            var suffix =  Date.now();
            cb(null, suffix+'_' + file.originalname )
       
        }
    })
       
    // Define the maximum size for uploading
    // picture i.e. 1 MB. it is optional
    const maxSize = 1 * 1000 * 1000;
        
    var upload = multer({ 
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: function (req, file, cb){
        
            // Set the filetypes, it is optional
            var filetypes = /jpeg|jpg|png/;
            var mimetype = filetypes.test(file.mimetype);

          

            var extname = filetypes.test(path.extname(
                        file.originalname).toLowerCase());
           
            
            if (mimetype && extname) {
                return cb(null, true);
            }
            
            cb("Error: File upload only supports the "
                    + "following filetypes - " + filetypes);
        } 
    
    // mypic is the name of file attribute
    }).single("mypic");  

  // path, callback handler
    app.get('/', (req,res) =>{
        res.send('Hello WOrld');
        console.log(process.env.PORT);
    });

    
    app.route('/api/courses')
        .get(documentCtrl.list_all_courses);
    app.route('/api/courses/:id')
        .get(documentCtrl.read_a_course);

    // todoList Routes
    app.route('/documents')
    .get(documentCtrl.list_all_documents);
    
    // post route
   /*  app.route('/api/documents/predict', upload.single('productImage'))
    .post(documentCtrl.predict_document); */
    app.post("/api/documents/predict",  function (req, res, next) {
        //console.log(req.file);
     
        
        // Error MiddleWare for multer file upload, so if any
        // error occurs, the image would not be uploaded!
       
        upload(req,res,function(err) {
  
        if(err) {
    
                // ERROR occured (here it can be occured due
                // to uploading image of size greater than
                // 1MB or uploading different file type)
                res.send(err)
            }
            else {
                console.log('success');
                //let data = fs.createReadStream(req.file.path,'utf8');
               
                let reqURL = req.protocol + "://" + req.headers.host + "/";
                console.log(req.file);
                predictObj.start_process(req.file.path,reqURL, res);
               /*  (async () => {
                    predictObj.start_process(req.file.path,reqURL, res).then(predictionsResult=>{
                        console.log('after  start_process');
                        let result = JSON.stringify(predictionsResult);
                        console.log(result);
                      
                    });  
                   
                })(); */
              /*   let result = predictObj.start_process(req.file.path,reqURL);
                console.log(result); */
                
               /*  fs.readFile(req.file.path, function(err, data) {
                   
                   // console.log(req.file);
                    predictObj.start_process(req.file.path, req.url);
                    //console.log(data);
                  }); */
               // console.log(data);
                // SUCCESS, image successfully uploaded
               // res.send(`load successfuly ${result} `);
            }
        })
    });
   
   // .post(todoList.create_a_task);


  
 //   .put(todoList.update_a_task)
  //  .delete(todoList.delete_a_task);
};

