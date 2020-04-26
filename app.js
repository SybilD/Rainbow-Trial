// application.use("/static", express.static('./static/'));
var express = require ('express');
//var http = require('http');
var https = require('https');
var fs = require('fs');

var privateKey  = fs.readFileSync('./localhost.key', 'utf8');
var certificate = fs.readFileSync('./localhost.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var mysql = require('mysql');
var router = express.Router();
var application = express();

// your express configuration here

//var httpServer = http.createServer(application);
var httpsServer = https.createServer(credentials, application);

let RainbowSDK = require("rainbow-node-sdk");
var bodyParser = require('body-parser');
var temp_info ;
var urlencodedParser = bodyParser.urlencoded({extended:false});
//var server = http.createServer(app);
var availableAgents;
var name ;
var skill;
var add_info;
var agentID;
var agentName;
var agent_contact;
var count;
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mysampletable"
  });



var queryTable = ["SELECT * FROM customers","SELECT * FROM admins","SELECT * FROM ad_available","SELECT * FROM available_skills","SELECT * FROM queue"];  
//var insert = ("INSERT INTO ad_available (Skills, ad_status) VALUES (%s,%s)", skillName,companyName);
//var sql = 'SELECT COUNT(*) FROM admins AS IDCount FROM ID WHERE availability = ?'
// Load the SDK

application.get('/', (req, res) => {
    res.send('Now using https..');
 });

// Define your configuration
let options = {
    "rainbow": {
        "host": "sandbox"
    },
    "credentials": {
        "login": "ke_dong@mymail.sutd.edu.sg", // To replace by your developer credendials
        "password": "07G1[3V?Dd'6" // To replace by your developer credentials
    },
    // Application identifier
    "application": {
        "appID": "2c2904d06d6d11eaa8fbfb2c1e16e226",
        "appSecret": "hpZzSyC6Btq23dMlF4IiJAWBhEPpvuYn8AcidljOHCOpp0FWWccrRG9xTIZ9KlaI"
    },
    // Logs options
    "logs": {
        "enableConsoleLogs": true,
        "enableFileLogs": false,
        "color": true,
        "level": 'debug',
        "customLabel": "vincent01",
        "system-dev": {
            "internals": false,
            "http": false,
        }, 
        "file": {
            "path": "/var/tmp/rainbowsdk/",
            "customFileName": "R-SDK-Node-Sample2",
            "level": "debug",
            "zippedArchive" : false/*,
            maxSize : '10m',
            maxFiles : 10 // */
        }
    },
    // IM options
    "im": {
        "sendReadReceipt": true,
        "messageMaxLength": 1024, // the maximum size of IM messages sent. Note that this value must be under 1024.
        "sendMessageToConnectedUser": false, // When it is setted to false it forbid to send message to the connected user. This avoid a bot to auto send messages.
        "conversationsRetrievedFormat": "small", // It allows to set the quantity of datas retrieved when SDK get conversations from server. Value can be "small" of "full"
        "storeMessages": true, // Define a server side behaviour with the messages sent. When true, the messages are stored, else messages are only available on the fly. They can not be retrieved later.
        "nbMaxConversations": 15, // parameter to set the maximum number of conversations to keep (defaut value to 15). Old ones are removed from XMPP server. They are not destroyed. The can be activated again with a send to the conversation again.
        "rateLimitPerHour": 1000, // Set the maximum count of stanza messages of type `message` sent during one hour. The counter is started at startup, and reseted every hour.
        //"messagesDataStore": DataStoreType.StoreTwinSide // Parameter to override the storeMessages parameter of the SDK to define the behaviour of the storage of the messages (Enum DataStoreType in lib/config/config , default value "DataStoreType.UsestoreMessagesField" so it follows the storeMessages behaviour)<br>
                              // DataStoreType.NoStore Tell the server to NOT store the messages for delay distribution or for history of the bot and the contact.<br>
                              // DataStoreType.NoPermanentStore Tell the server to NOT store the messages for history of the bot and the contact. But being stored temporarily as a normal part of delivery (e.g. if the recipient is offline at the time of sending).<br>
                              // DataStoreType.StoreTwinSide The messages are fully stored.<br>
                              // DataStoreType.UsestoreMessagesField to follow the storeMessages SDK's parameter behaviour. 
    }
};


// Instantiate the SDK
let rainbowSDK = new RainbowSDK(options);

rainbowSDK.events.on('rainbow_onready', function() {
    // do something when the SDK is connected to Rainbow
    console.log("DEMO::Rainbow is onReady!!!!");
});



rainbowSDK.events.on('rainbow_onerror', function(err) {
    // do something when something goes wrong
    console.log("DEMO::Rainbow is onError!!!!");
});


rainbowSDK.start();

console.log("DEMO::Rainbow is started!!!");









//Server Connection
connection.connect(function(err) {
    if (err) {throw err;}
    else{console.log("Connected!");}  
});


application.use(express.static("static"));

application.post('/add',urlencodedParser , function(req,resp){
    connection.query(queryTable[2],function(error, result, fields){
        
    });
});



application.post('/information', urlencodedParser,function(req, resp){
    temp_info = req.body;

    console.log("here is the info fetched from main page");
    console.log(temp_info);
    
    name = temp_info.cust_name;
    for(i in temp_info.additionalInfo){
        if(temp_info.additionalInfo[i] != '') {
            var skillAndAdd = temp_info.additionalInfo[i].split("|");
            skill = skillAndAdd[0];
            add_info = skillAndAdd[1];
            console.log("here is the info after processing");
            console.log(name,skill,add_info);

        }
    }
    resp.redirect('/index.html');
});



application.get('/retrieve',function(req,resp){
    var result = name + ',' + skill + ',' + add_info;
    resp.send(JSON.stringify(result));
});


application.get('/name/:userinfo', urlencodedParser,function(req, resp){
    var infoPassed = req.params.userinfo
    console.log(infoPassed);
    console.log(typeof infoPassed);
    var wdnmd = infoPassed.split('"').join('');
    console.log(wdnmd);
    var infoList = wdnmd.split(",");
    console.log(infoList);
    name = infoList[0];
    console.log(name);
    skill = infoList[1];
    console.log(skill);
    add_info = infoList[2];
    console.log(add_info);

    
    connection.query(queryTable[2],function(error, result, fields){// ad_available
        //callback
        if(!!error){
            console.log('error in query\n');}
        else{
            console.log('Successful Query for availableAgents\n');
            
            availableAgents = new Map();
            for(i in result){
                var agentList =[];
                agentList = result[i].ad_status.split(",");
                //console.log(typeof agentList);
                var sk = result[i].Skills;
                availableAgents.set(sk, agentList);
            }
            console.log(availableAgents);
            console.log(availableAgents.has(skill));
            var emptyList = [''];
            if(availableAgents.has(skill)){
                //console.log(availableAgents.get(skill));
                console.log("found matching skills, searching for available agents...");
                agentList = availableAgents.get(skill);
                console.log(agentList);
                console.log(typeof agentList);
                console.log(agentList.length);
                placeInQueue(name,skill);
            }
        }
        
        function placeInQueue(name,skill){
            connection.query(queryTable[4],function(error, result, fields){//queue
                if(!!error){
                    console.log('error in query1\n');
                }
                
                else{
                    console.log('Successful Query for Queue\n');
                    var queue =new Map();
                    
                    for(i in result){
                        var customerList = result[i].customer_name.split(",");
                        var requiredSkills = result[i].skills;
                        queue.set(requiredSkills, customerList);
                    }
                    customerList = queue.get(skill);
                    console.log(queue);
                    console.log(customerList);
                    console.log(typeof customerList);
                    if(customerList.includes(name)){
                        var reply = (customerList.indexOf(name));
                        if(reply!= 1 ){
                            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                            console.log(reply);
                            resp.send(JSON.stringify(reply));
                        }
                        else{
                            console.log("First in queue! looking for a match");
                            for(var i = 0; i < agentList.length; i++){
                                console.log("HEY AGENT ID is right here!!!!!!!!!!!!!!!1");
                                console.log(agentList,typeof agentList, agentList.length);
                                var agentInfo = agentList[i];
                                console.log(agentInfo, typeof agentInfo);
                                agentInfoList = agentInfo.split(", ");//["agentA|adfhgdhkgakh0","agentB|sdgfhgjbdhj"]
                                console.log(agentInfoList, typeof agentInfoList);
                                agent_temp = agentInfoList[0].split("|");
                                console.log(agent_temp,typeof agent_temp);
                                agentID = agent_temp[1];
                                agentName = agent_temp[0];
                                console.log(agentID,typeof agentID);
                                console.log(i,"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

                                rainbowSDK.contacts.getContactById(agentID, true).then(function (entityFound) {
                                    console.log("HEY IM HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    console.log(entityFound);
                                    console.log(entityFound.presence,typeof entityFound);
                                    if (entityFound) {
                                        if(entityFound.presence=="online" || entityFound.presence == "away"){
                                            console.log("ENTITY FOUND!!!!!! connect to agent!!!");

                                            var ready = agentList.splice(i);

                                            
                                            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                                            console.log(agentList);
                                            console.log(i);
                                            console.log(ready);
                                            var sql = "UPDATE ad_available SET ad_status = ?  WHERE Skills = ? " ;
                                            connection.query(sql,[ready,skill],function(error, result, fields){
                                                if(!!error){
                                                console.log('error in query\n');}
                                            });


                                            //create guest account
                                            let userFirstname = name;    //name retrieved from db
                                            let userLastname = skill;    //skill retrived from db
                                            console.log(userFirstname,userLastname);
                                            let userEmailAccount = userFirstname.concat(userLastname,"@esc.com");
                                            let userPassword = "Password1!";
                        

                                
                                            rainbowSDK.admin.createUserInCompany(userEmailAccount, userPassword, userFirstname, userLastname).then((user) => {
                                                // Do something when the user has been created and added to that company
                                                console.log("DEMO::Customer1 created successfully with name: " + userFirstname + ", skill: " + userLastname + ", and fake email address: " + userEmailAccount);
                                                //setTimeout(deleteAccount, 60000);
                                                
                                            }).catch((err) => {
                                                // Do something in case of error
                                                console.log("DEMO::Customer account fail to create.");

                                            });


                                            
                                            
                                            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7");
                                            customerList.splice(0);
                                            console.log(customerList);
                                            var final = customerList.toString();
                                            console.log("connect to agent!!!");
                                            var delete_customer = "UPDATE queue SET customer_name = ?  WHERE skills = ? " ;
                                            connection.query(delete_customer,[final,skill],function(error, result, fields){//queue
                                                if(!!error){
                                                    console.log('error in query\n');
                                                }
                                            });

                                            agentList.splice(i-1);
                                            console.log(agentList);
                                            var final = agentList.toString();
                                            console.log("deleting agent from ad_available");
                                            var delete_agent= "UPDATE ad_available SET ad_status = ?  WHERE Skills = ? " ;
                                            connection.query(delete_agent,[final,skill],function(error, result, fields){//queue
                                                if(!!error){
                                                    console.log('error in query\n');
                                                }
                                            });

                                            console.log("hey i reached here!!!");
                                            resp.send('0');
                                            return;

                                        }
                                        else{
                                            console.log("No available agent, finding next in line!!!!!!!!");
                                        }
                                            
                                    
                                    } 
                                    
                                    else {
                                        // No entity returned
                                        console.log("[app] :: No contact found")
                                    }
                                }).catch(function (error) {
                                    // In case of error when searching for contact
                                    console.log("[app] :: Error retrieving contact", error);
                                });
                            }


                        }
                        
                    }
                    else{
                        connection.query(queryTable[4],function(error, result, fields){//queue
                            if(!!error){
                                console.log('error in query2\n');
                            }
                            
                            else{
                                console.log('Successful Query for Queue\n');
                                customerList.push(name);
                                var ready = customerList.toString();
                                var sql = "UPDATE queue SET customer_name = ?  WHERE skills = ? " ;
                                connection.query(sql,[ready,skill],function(error, result, fields){
                                    if(!!error){
                                    console.log('error in query\n');}
                                });
                                console.log("Customer placed in queue, waiting for an available agent"); 
                                
                            }

                        });

                    }
                        
                }
            });
        }
    });
    
});

application.get('/chatinfo',function(req,resp){
    console.log(name,skill,add_info);
    var adInfo = name + ',' + skill + ',' + add_info + ',' + agentID + ',' + agentName;
    console.log(adInfo);
    resp.send(JSON.stringify(adInfo));


})

application.get('/signout/:info', urlencodedParser,function(req,resp){    
    var allInfo = req.params.info;
    console.log(allInfo);
    var wdnmd = allInfo.split('"').join('');
    console.log(wdnmd);
    var infoList = wdnmd.split(",");
    console.log(infoList);
    var name_d = infoList[0];
    var skill_d = infoList[1];
    var add_info_d = infoList[2];
    var agentID_d = infoList[3];
    var agentName_d = infoList[4];

    
    userEmailAccount = name.concat(skill_d,"@esc.com");
    
    

    connection.query(queryTable[2],function(error, result, fields){
        if(!!error){
            console.log('error in query\n');
        }
        var amap = new Map();

        for(i in result){
            var agentList_d =[];
            agentList_d = result[i].ad_status.split(",");
            //console.log(typeof agentList);
            var sk = result[i].Skills;
            amap.set(sk, agentList_d);
        }
        agentList_d = amap.get(skill_d);
        console.log(agentList_d,typeof agentList_d);
     
        var inputStr = agentName_d.concat("|",agentID_d);
        console.log(inputStr,typeof inputStr);
        var answer = agentList_d.toString().concat(",",inputStr);
        console.log("here is the answer!",answer);
        agentList_d = agentList_d.push(inputStr);
        var update_ad = "UPDATE ad_available SET ad_status = ?  WHERE Skills = ? " ;
        connection.query(update_ad,[answer,skill_d],function(error, result, fields){
            if(!!error){
            console.log('error in query\n');}
        });
    });

    deleteAccount();
    async function deleteAccount(){
        //delete account
            
            var customer = await rainbowSDK.contacts.getContactByLoginEmail(userEmailAccount, true);
            
            console.log("DEMO::Contact for customer found");
            var userId = customer.id;
            //console.log("DEMO::Id for customer1 found");
    
            rainbowSDK.admin.deleteUser(userId).then((user) => {
                // Do something when the user has been deleted
                console.log("DEMO::Customer deleted.");
            }).catch((err) => {
                // Do something in case of error
                console.log("DEMO::Customer fail to delete.");
            });
    
        }

})

/*
application.listen(3000 ,function(){
    console.log('Listening to port 3000');
});
*/
httpsServer.listen(3000, () => {
    console.log("server starting on port : " + 3000)
  });


module.exports = {
    express,
    fs,
    mysql,
    queryTable,
    connection,
    application,
};