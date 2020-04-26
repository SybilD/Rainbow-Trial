var app = require('./app.js');
var availableAgents =new Map();

function matchAgent(name, damn){ 
    
    var sql = "UPDATE queue SET customer_name = ?  WHERE skills = ? " ;
    console.log(sql);
    app.connection.query(sql,[name,damn],function(error, result, fields){// ad_available
            //callback
        if(!!error){
            console.log('error in query\n');}
        else{
            
        }
    });
        
}



matchAgent("WOW","Delivery");