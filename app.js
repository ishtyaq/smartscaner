const express = require('express');
const app=express();

var bodyParser = require('body-parser');
const TeachableMachine = require("@sashido/teachablemachine-node");


app.use('/uploads', express.static('uploads'));
app.use('/mymodel', express.static('mymodel'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
const authRouter = require("./api/routes/authRoutes");
var docRoutes = require("./api/routes/documentRoutes"); 


//docRoutes(app); //register the route
app.use("/api/auth", authRouter);
app.use("/api/documents", docRoutes);

// app.use("/orders", orderRoutes);
app.use(function(req, res, next) {
    res.status(req.status || 500);
    res.json({
        error: {
        message: error.message
        }
    });
  });
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
// PORT
//const port = process.env.PORT || 3000;
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
//app.listen(port);

app.listen(port, ()=> console.log(`Listening on port ${port}`));