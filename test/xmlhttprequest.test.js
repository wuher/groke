/*
 * 20.2.2010 jedi
 *
 * xhr test
 */

/*jslint onevar: true, undef: true, eqeqeq: true, nomen: true,
 plusplus: true, bitwise: true, newcap: true, rhino: true */
/*global exports groke test */


var xhr = require('xmlhttprequest');
var eventq = require('event-queue');

var xhreq = new xhr.XMLHttpRequest();
xhreq.open("GET", "http://www.kuuskeri.com/", true);
xhreq.onreadystatechange = function () {
    if (xhreq.readyState === 4) {
        print(xhreq.status);
//         print(xhreq.responseText);
    }
};
xhreq.send();

for (var p in xhreq) {
    print("XMLHttpRequest." + p + " : " + typeof xhreq[p]);
}

print('enter event loop');
eventq.enterEventLoop();
