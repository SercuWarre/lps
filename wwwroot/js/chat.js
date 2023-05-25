"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
var object = {1 : [0,0,0,0,0,0,0]};
//Disable the send button until connection is established.

connection.on("ReceiveMessage", function (user, message) {
    
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    const array = message.split(',');
    window.object[user] = array;

    for (const [key, value] of Object.entries(window.object)) {
        console.log(`${key}: ${value}`);
    }

    
});

connection.start().then(function () {
}).catch(function (err) {
    return console.error(err.toString());
});
