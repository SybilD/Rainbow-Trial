// application.use("/static", express.static('./static/'));
var express = require ('express');
var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var router = express.Router();
var application = express();
//var server = http.createServer(app);

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mysampletable"
  });



var queryTable = ["SELECT * FROM customers","SELECT * FROM admins","SELECT * FROM ad_available","SELECT * FROM available_skills","SELECT * FROM queue"];  
//var insert = ("INSERT INTO ad_available (Skills, ad_status) VALUES (%s,%s)", skillName,companyName);
//var sql = 'SELECT COUNT(*) FROM admins AS IDCount FROM ID WHERE availability = ?'


connection.connect(function(err) {
    if (err) {throw err;}
    else{console.log("Connected!");}  
});






application.get('/try', function(req, resp){
    //resp.send("hello world");
    var a = "sdfsdff";
    resp.send(a);
    //resp.sendFile('index.html', {root })
    //res.sendFile(path.join("D:\xampp\xampp\htdocs\projects\ESC",'/index.html'));
 
    
    // connection.query(queryTable[3],function(error, result, fields){//available skills
    //     //callback
    //     if(!!error){
    //         console.log('error in query\n');}
    //     else{
    //         console.log('Successful Query for available_skills\n');     
    //         console.log(result);
    //         var availableSkills = [];
    //         for(i in result){
    //             console.log( result[i].skills);
    //             availableSkills.push(result[i].skills);
    //         }
    //         console.log(availableSkills);

    //         fs.writeFile('temp.txt', availableSkills, function (err) {
    //             if(!!err){console.log('error in writing');}
    //             console.log('Saved!');
    //         });

    //     }
    // });

    // connection.query(queryTable[0],function(error, result, fields){//customers table
    //     //callback
    //     if(!!error){
    //         console.log('error in query\n');}
    //     else{
    //         console.log('Successful Query for customer table\n');     
    //         // var availableSkills = [];
    //         // for(i in results){
    //         //     console.log( result[i]);
    //         //     availableSkills.push(result[i].skills);
    //         // }
    //         console.log(result);
    //     }
    // });

    // connection.query(queryTable[1],function(error, rows, fields){//admin
    //     //callback
    //     if(!!error){
    //         console.log('error in query\n');}
    //     else{
    //         console.log('Successful Query\n');
    //         console.log(typeof rows[0]);
    //         console.log(rows[0]);
    //         // fs.writeFile('temp.txt', rows[0], function (err) {
    //         //     if(!!err){console.log('error in writing');}
    //         //     console.log('Saved!');
    //         // });

    //     }
    //     //connection.end();
    //     //console.log("disconnected with db!");
    // });

    // connection.query(queryTable[2],function(error, result, fields){// ad_available
    //     //callback
    //     if(!!error){
    //         console.log('error in query\n');}
    //     else{
    //         console.log('Successful Query for availableAgents\n');
    //         for(i in result){
    //             var agentList = result[i].ad_status.split(",");
    //             var sk = result[i].Skills;
    //             console.log(result[i].Skills);
    //             availableAgents.set(sk, agentList);
    //         }
    //         console.log(availableAgents);
    //     }
        
       
    // });

    
    // connection.end();
    // console.log("disconnected with db!");
})

application.get('/skill', function(req, res){
    fs.readFile('./db.json', function(err, data){

    res.send(data.toString());
    })
});

application.get('/actual', function(req, res){
    fs.readFile('./db.json', function(err, data){
    var skill = JSON.parse(data.toString()).skillTags;
    res.json(skill);
    })
});

application.listen(3000 ,function(){
    console.log('Listening to port 3000');
});


module.exports = {
    express,
    fs,
    mysql,
    queryTable,
    connection,
    application,
};