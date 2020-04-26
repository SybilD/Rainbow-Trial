var app = require('./app.js');
var queryTable = ["SELECT * FROM customers",
"SELECT * FROM admins",
"SELECT * FROM ad_available",
"SELECT * FROM available_skills",
"SELECT * FROM queue"];  



function matchAgent(skill, name){ 
    app.connection.query(queryTable[2],function(error, result, fields){// ad_available
            //callback
        if(!!error){
            console.log('error in query\n');}
        else{
            console.log('Successful Query for availableAgents\n');
            var availableAgents = new Map();
            for(i in result){
                var aList = result[i].ad_status.split(",");
                var sk = result[i].Skills;
                console.log(result[i].Skills);                    
                availableAgents.set(sk, aList);
            }
            console.log(availableAgents);
            if(availableAgents.has(skill)){
                console.log(aList);
                console.log("found matching skills, searching for available agents...");
                console.log(aList.length);
                if(aList.length == 1){
                    console.log("No available agent, place in queue!");
                    placeInQueue(skill,name);
                }
                else{
                //window.location.href = 'newPage.html';
                    console.log("connect to agent!!!");
                }

            }
            
        }
    });

    function placeInQueue(skill, name){
        
        app.connection.query(queryTable[4],function(error, result, fields){//queue
            if(!!error){
                console.log('error in query1\n');
            }
            
            else{
                console.log('Successful Query for Queue\n');
                var queue =new Map();//a map which keys are the skills and values are a string of names of agents separated by comma
                for(i in result){
                    var cList = result[i].customer_name.split(",");
                    var requiredSkills = result[i].skills;
                    console.log(result[i].skills);
                    queue.set(requiredSkills, cList);
                }
                console.log(queue);


                var customerList = queue.get(skill);
                console.log(customerList);

                if(customerList[0] != name){
                    app.connection.query(queryTable[4],function(error, result, fields){//queue
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
                                    console.log("there are %i people infront of you", customerList.indexOf(name));
                                }
                            
                                else{
                                    customerList.push(name);
                                    var ready = customerList.toString();
                                    var sql = "UPDATE queue SET customer_name = ?  WHERE skills = ? " ;
                                    console.log(sql);
                                    app.connection.query(sql,[ready,skill],function(error, result, fields){
                                        if(!!error){
                                        console.log('error in query\n');}
                                    });
                                    console.log("Customer placed in queue, waiting for an available agent");  
                                    matchAgent(skill,name);
                                }
                            }
                        }
                    });

                    if(customerList[0] == name){
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
    
    
        
}


matchAgent("Delivery","Boy");

// class Agent{

//     assign(name,skills){
//         for(var i =0; i< skills.length; i++){
//             if(typeof skills[i] != 'string' || app.availableSkills.includes(skills[i]) == false){
//                 console.log( "please select valid skills");
//             }
            
//             if(app.availableAgents.has(skills[i])){
//                 var agentList = app.availableAgents.get(skills[i]);
//                 agentList.push(name);
//                 //console.log("pushed to skillList!");
//             }
//         }
        
//         if(typeof name != 'string' || name == ""){
//             console.log( "please enter the correct agent name!");
//         }
       
//         var skillTags = skills;
//         var connected = skillTags.join();//joining all elements in the list to give an string 


//         // Id = Math.floor(10000 + Math.random() * 90000);
//         // avoidDuplicate(this.Id);
//         console.log( 'Agent created with name as '+ name);
//         var insertAd = ("INSERT INTO admins (ad_name, skill_tags) VALUES (%s,%s)", name, connected);
//         console.log(insertAd);
//         app.connection.query(insertAd,function(error, result, fields){
//         });
        
//     }

    
//     setAvailable(skill,name){
//         for(var i =0; i< skillTags.length; i++ ){
//             //var insert = ("INSERT INTO ad_available (Skills, ad_status) VALUES (%s,%s)", this.skillTags[i],name)
//             app.connection.query("SELECT * FROM ad_available",function(error, result, fields){
//                 for(j in results){
//                     if(skillTags[i]==result[j].Skills){
//                         var agentList = result[j].ad_status.split(",");
//                         agentList.push(name);

//                     }
//                 }
//             });
//             console.log("updated the ad_available table!");
//         }
        
//     }

// }

// class Customer{
//     assign(name,requirement){
//         this.requirement = requirement;
//         if(typeof requirement != 'string' || availableSkills.includes(requirement) == false){
//             return "please select valid skills";  // which is not very likely to happend since the options are fixed...but is nice to look out for...
//         }
    
//         if(typeof name != 'string' || name.match("^[a-zA-Z]*") == false || name == ""){
//             return "please enter your name with letters only";
//         }
//         this.name = name;

//         //this.Id = Math.floor(10000 + Math.random() * 90000);//generate a random customerId
//         //avoidDuplicate(this.Id);
//         return "Hello " + name;
//     }

    // avoidDuplicate(Id){
    //     if(DM.currentActiveUser.includes(Id)){
    //         this.Id = Math.floor(10000 + Math.random() * 90000);
    //         checkDuplicate(Id);
    //     }
    //     else{break;}
    // }

    // checkAlive(){}//check how long has the user been inactive



// class SuperAdmin{
//     constructor(requirement){
//         this.Id = Math.floor(10000 + Math.random() * 90000);//generate a random customerId
//         avoidDuplicate(this.Id);
//     }

//     avoidDuplicate(Id){
//         if(DM.currentActiveUser.includes(Id)){
//             this.Id = Math.floor(10000 + Math.random() * 90000);
//             checkDuplicate(Id);
//         }
//         else{break;}
//     }

    
// }

// class CustomerHandler{
//     constructor(){

//     }

//     createCustomer(){
//         //creat with rainbow API...?
//     }
//     destroyCustomer(){
//         //delete customer
//     }
// }

// module.exports = {
//     matchAgent,
//     placeInQueue
// };