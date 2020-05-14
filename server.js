//server.js
var express = require('express');
var expobj = express();
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var cookieParser = require("cookie-parser");
const path = require('path');



// expobj.use(require('./routes'));
// requiring routes
var userRoutes = require("./routes/user");
var policeRoutes = require("./routes/police");
var adminRoutes  = require("./routes/admin");

//set port
var port = process.env.PORT || 8080;
//parse application/json
expobj.use(bodyparser.json());
//parse aplication/x-www url encoded 
expobj.use(bodyparser.urlencoded({extended:true}));
//method-override
expobj.use(methodOverride('X-HTTP-METHOD-OVERRIDE'));
expobj.set("view engine","ejs");
expobj.engine('ejs', require('ejs').__express);

expobj.use(express.static(path.join(__dirname,"public")));
mongoose.connect("mongodb://localhost/users",{useNewUrlParser: true, useUnifiedTopology: true});
//on connection
mongoose.connection.on('connected',function(){
    console.log('connected to database mongoDB @ 27017');
});
mongoose.connection.on('err', function(err){
    if(err){
        console.log('error in database connection:'+err);
    }
});
mongoose.connection.on('disconnected' , function (){
    console.log('disconnected from databasee monngoDB ');
});
process.on('SIGINT', function(){
    console.log('Disconnected from database mongoDB through app termination');
    process.exit(0);
});


/*******************************************************************************************************************
 |  |   |   |   |   |   |   |   |   INDEX ROUTE
*********************************************************************************************************************/
expobj.get("/",function(req,res) {
    res.render("server");    
});

expobj.use("/user",userRoutes);
expobj.use("/admin",adminRoutes);
expobj.use("/police",policeRoutes);


//startup our app
expobj.listen(port);
//infrom to the user
console.log('Node server has been started');
console.log('\nTo check it pen any web browser and type "localhost:'+port+'"');
exports = module.exports = expobj;

