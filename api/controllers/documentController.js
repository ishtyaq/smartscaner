'use strict';
var document = require('../models/documentModel');


exports.list_all_documents = function(req, res) {
    /* Task.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    }); */
    res.send('list all documents');
  };
  
exports.list_all_courses = function (req, res){
   // res.send([1,2,3,4,5]);
   res.send(document);
};

exports.read_a_course = function (req, res){
    // res.send([1,2,3,4,5]);
    let doc = document.find( c => c.id == parseInt(req.params.id));
    if(!doc) res.status(404).send('The course with given id was not found');
    res.send(doc);
 };

 exports.predict_document = function (req, res){
    // res.send([1,2,3,4,5]);
   // res.send(document);
  /* const adocument= {
       id:document.length +1,
       name: req.body.name
   };
   document.push(adocument);
   res.send(document);*/
   try {
        console.log(req.raw);
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
 };