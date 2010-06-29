/*
 *
 */


var xhrlib = require('xmlhttprequest');
var eventq = require('event-queue');

var xhr = new xhrlib.XMLHttpRequest();
xhr.open("GET", "http://www.google.com/", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        print(xhr.responseText);
        eventq.shutdown();
    }
};

xhr.send();

// enter event-loop
eventq.enterEventLoop();
