// application.use("/static", express.static('./static/'));
var express = require ('express');
var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var router = express.Router();
var application = express();
let RainbowSDK = require("rainbow-node-sdk");
var bodyParser = require('body-parser');
var temp_info ;
var urlencodedParser = bodyParser.urlencoded({extended:false});
//var server = http.createServer(app);
var name ;
var skill;
var add_info;
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
    console.log(temp_info);
    name = temp_info.cust_name;
    console.log(temp_info.additionalInfo);
    for(i in temp_info.additionalInfo){
        if(temp_info.additionalInfo[i] != '') {
            var skillAndAdd = temp_info.additionalInfo[i].split("|");
            skill = skillAndAdd[0];
            add_info = skillAndAdd[1];
            console.log(skillAndAdd);
            console.log(name,skill,add_info);

        }
    }
    resp.redirect('/index.html');
});

application.get('/name', function(req, resp){

    connection.query(queryTable[2],function(error, result, fields){// ad_available
        //callback
        if(!!error){
            console.log('error in query\n');}
        else{
            console.log('Successful Query for availableAgents\n');
            
            var availableAgents = new Map();
            for(i in result){
                var agentList =[];
                agentList = result[i].ad_status.split(",");
                console.log(typeof agentList);
                var sk = result[i].Skills;
                availableAgents.set(sk, agentList);
            }
            console.log(availableAgents);
            console.log(availableAgents.has(skill));
            var emptyList = [''];
            if(availableAgents.has(skill)){
                console.log(availableAgents.get(skill));
                console.log("found matching skills, searching for available agents...");
                console.log(agentList);
                console.log(agentList[0]);
                console.log(typeof agentList[0]);
                console.log(agentList[0]== emptyList);
                if(agentList[0]== emptyList){
                    console.log("No available agent, place in queue!");
                    placeInQueue(name,skill);
                }
                else{
                //window.location.href = 'newPage.html';
                    console.log("connect to agent!!!");
                    // Start the SDK
                    rainbowSDK.start().then(() => {
                        // Do something when the SDK is connected to Rainbow
                        console.log("DEMO::Rainbow is started!!!")
                        //create guest account
                        let userFirstname = name;    //name retrieved from db
                        let userLastname = skill;    //skill retrived from db
                        let userEmailAccount = userFirstname.concat(userLastname,"@esc.com");
                        let userPassword = "Password1!";
    

            
                        rainbowSDK.admin.createUserInCompany(userEmailAccount, userPassword, userFirstname, userLastname).then((user) => {
                            // Do something when the user has been created and added to that company
                            console.log("DEMO::Customer1 created successfully with name: " + userFirstname + ", skill: " + userLastname + ", and fake email address: " + userEmailAccount);
                            //setTimeout(deleteAccount, 60000);
                            //return resp.redirect('http://localhost:3000/chatpage.html');
                            
                        }).catch((err) => {
                            // Do something in case of error
                            console.log("DEMO::Customer account fail to create.");

                        });
                        console.log("hey i reached here!!!");

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
                        
                    });
                    
                    return resp.redirect('/chatpage.html');
                    
                    //window.localStorage.setItem()
                    //return resp.redirect('http://localhost/chatpage.html');
                }

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
                        var cList = result[i].customer_name.split(",");
                        var requiredSkills = result[i].skills;
                        console.log(result[i].skills);
                        queue.set(requiredSkills, cList);
                    }
                    console.log(queue);
                    console.log(cList);
    
                    if(cList[0] != name){
                        connection.query(queryTable[4],function(error, result, fields){//queue
                            if(!!error){
                                console.log('error in query2\n');
                            }
                            
                            else{
                                console.log('Successful Query for Queue\n');
                                for(i in result){
                                    var cList = result[i].customer_name.split(",");
                                    var requiredSkills = result[i].skills;
                                    console.log(result[i].skills);
                                    queue.set(requiredSkills, cList);
                                }
                            
    
    
                                if (queue.has(skill)){
                                    var customerList = queue.get(skill);
                                    console.log("hey this is the customerlist");
                                    console.log(customerList);
                                    if(customerList.includes(name)){
                                        var reply = ("there are %i people infront of you", customerList.indexOf(name));
                                        console.log(reply);
                                        resp.send(JSON.stringify(reply));
                                    }
                                
                                    else{
                                        customerList.push(name);
                                        var ready = customerList.toString();
                                        var sql = "UPDATE queue SET customer_name = ?  WHERE skills = ? " ;
                                        console.log(sql);
                                        connection.query(sql,[ready,skill],function(error, result, fields){
                                            if(!!error){
                                            console.log('error in query\n');}
                                        });
                                        console.log("Customer placed in queue, waiting for an available agent");  
                                    }
                                }
                            }
                        });
    
                        if(queue.get(skill)[0] == name){
                            //window.location.href = 'newPage.html';
                            customerList.splice(0, 1);
                            var final = customerList.toString();
                            console.log("connect to agent!!!");
                            app.connection.query(sql,[final,skill],function(error, result, fields){//queue
                                if(!!error){
                                    console.log('error in query\n');
                                }
                            });
                        }
                    
    
                    }
                    console.log("Customer placed in queue, waiting for an available agent");  
                    
                }
            });
        }
    });
});




application.listen(3001 ,function(){
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