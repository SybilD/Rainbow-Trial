/* Wait for the page to load */
$(function() {
    console.log("[DEMO] :: Rainbow Application started!");


    // Update the variables below with your applicationID and applicationSecret strings
    var applicationID = "e428b8805f1411ea9a6dcf004cf8c14e";
    var applicationSecret = "H5s9R7kNuLarkk5SfAUmrZltWZg09trT0eTEXhBgU8WjMIiwDCZnrzRxAGUhjdY4";

    /* Bootstrap the SDK */
    angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

    /* Callback for handling the event 'RAINBOW_ONREADY' */
    var onReady = function onReady() {
        
        console.log("[DEMO] :: On SDK Ready !");
        // do something when the SDK is ready
        $("#loginForm").submit(function logIn(){
        var myRainbowLogin = document.getElementById("username").value;       // Replace by your login
        var myRainbowPassword = document.getElementById("password").value; // Replace by your password

        // The SDK for Web is ready to be used, so you can sign in
        $('#signInButton').attr('disabled', true);
            rainbowSDK.connection.signin(myRainbowLogin, myRainbowPassword)
            .then(function(account) {
                // Successfully signed to Rainbow and the SDK is started completely. Rainbow data can be retrieved.
                $("#login").css("display", "none");
                document.getElementById("nameDisplayed").innerHTML = myRainbowLogin;
                //populateContactList();
                console.log('Signed in');
            })
            .catch(function(err) {
                // An error occurs (e.g. bad credentials). Application could be informed that sign in has failed
                console.log('problem logging in');
                document.getElementById('status').innerHTML = 'Login and/or password invalid. Try again!';
                $('#signInButton').attr('disabled', false);
                
            });

        });

      
    };   //end of onReady

    var onLoaded = function onLoaded() {
        console.log("[DEMO] :: On SDK Loaded !");

        // Activate full SDK log
        rainbowSDK.setVerboseLog(true);

        rainbowSDK
            .initialize(applicationID, applicationSecret)
            .then(function() {
                console.log("[DEMO] :: Rainbow SDK is initialized!");
            })
            .catch(function(err) {
                console.log("[DEMO] :: Something went wrong with the SDK...", err);
            }); 
    };  //end of onLoad


    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(event) {
        console.log("checking connections!!!");
        let status = event.detail.status;
        console.log("set status!!!");
        switch(status) {
            case rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED:
                // The state of the connection has changed to "connected" which means that your application is now connected to Rainbow
                console.log('STATUS: CONENCTED!!!');
                document.getElementById("connectionStatus").innerHTML = "CONNECTED";
                break;
            case rainbowSDK.connection.RAINBOW_CONNECTIONINPROGRESS:
                // The state of the connection is now in progress which means that your application try to connect to Rainbow
                console.log('STATUS: IN PROGRESS');
                document.getElementById("connectionStatus").innerHTML = "CONNECTING";
                //$("#avatar").inner("CONNECTION IN PROGRESS"); 

                break;
            case rainbowSDK.connection.RAINBOW_CONNECTIONDISCONNECTED:
                // The state of the connection changed to "disconnected" which means that your application is no more connected to Rainbow
                console.log('STATUS: DISCONNECTED');
                document.getElementById("connectionStatus").innerHTML = "DISCONNECTED";
                break;
            default:
                //deafult status: connected unless other evernts happen
                document.getElementById("connectionStatus").innerHTML = "CONNECTED";
                console.log("default status!!!");
                break;
        };
   
    };  //end of ConnectionStatus
    
    var onSigned = function onSigned(event) {
        let account = event.detail;
        console.log("onSigned")
        // Authentication has been performed successfully. Account information could be retrieved.
    };  //end of onSigned

    

    

    var Call = angular.element(document.querySelector('body')).injector().get('Call');
    var Contact = angular.element(document.querySelector('body')).injector().get('Contact');
    var Conversation = angular.element(document.querySelector('body')).injector().get('Conversation');

    var selectedContact = null;
    var associatedConversation = null;

    

    

    var onStarted = function onStarted(event, account) {
        // Do something once the SDK is ready to call Rainbow services
        /* Handler called when user clicks on a contact */
        var onContactSelected = function(contactId) {
            selectedContact = rainbowSDK.contacts.getContactById(contactId);
        }

        //UPDATE THE CONVERSATION HEADER ELEMENT
        var header = document.getElementById("conversationHeader");
        header.innerHTML = "Conversation with <b>" + selectedContact._displayName + "</b>" ;

        rainbowSDK.conversations.openConversationForContact(selectedContact)
            .then(function (conversation) {
                associatedConversation = conversation;
                return conversation;
        
            })
            .then(conversation => rainbowSDK.im.getMessagesFromConversation(conversation, 30))
            .then(result => {
                if (result.messages){
                    var messages = result.messages;
                    for (var message in messages){
                        if (messages[message].from.loginEmail === username){
                            $('.card-body').append(getSendMessageHTML(messages[message].data,messages[message].from.avatar.src));
                        }
                        else{
                            $('.card-body').append(getReceivedMessageHTML(messages[message].data,messages[message].from.avatar.src));
                        }

                    }
                }
                console.log(result)
            })
            .catch(function (err) {
                // An error occurs (e.g. bad credentials). Application could be informed that sign in has failed
                console.log(err);
            });
    };



    /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady)

    /* Listen to the SDK event RAINBOW_ONLOADED */
    document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded)

    // Listen when the SDK is signed
    document.addEventListener(rainbowSDK.connection.RAINBOW_ONSIGNED, onSigned)

    // Listen when the SDK is started
    document.addEventListener(rainbowSDK.connection.RAINBOW_ONSTARTED, onStarted)

    // Subscribe to Rainbow connection change event
    document.addEventListener(rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED, onConnectionStateChangeEvent)

    /* Load the SDK */
    rainbowSDK.load(); 


/*
    // New Message Received
    var onNewMessageReceived = function(event, message, conversation) {
        rainbowSDK.im.markMessageFromConversationAsRead(associatedConversation, message);
        var guestMessage = $("<div class=\"leftSideMessage\">" + message.data + "</div><p>");
        var hostMessage = $("<div class=\"rightSideMessage\">" + message.data + "</div><p>");

        if(message.side === "L") {
            $('#messages').append(guestMessage);
        } else {
            $('#messages').append(hostMessage);
        }
        var elem = document.getElementById('chatMessages');
        elem.scrollTop = elem.scrollHeight; 
    }; 

    $(document).on(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessageReceived);


    $('.send_btn').on('click', function () {
        // Send message
        var message = $('#typeBar').val();
        $('.card-body').append(getSendMessageHTML(message, "https://via.placeholder.com/50"));
        $('#typeBar').val("");
        rainbowSDK.im.sendMessageToConversation(associatedConversation, message);
    });
    */


    
});


//REFRESH PAGE IN ORDER TO SIGN OUT - ARBITRARY SOLUTION GOOD ENOUGH FOR THE PROJECT
function signOut(){
    location.reload();
}




