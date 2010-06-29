Groke
=====

Groke is a JavaScript server for the JavaScript client. It offers REST
inspired approach into RPC services. Groke can be though of as a
platform for hosting web applications that are implemented using
JavaScript on both sides of the Iternet cloud. It simplifies the
partitioning of the application by hiding the networking details when
the client wants to use services offered by the server. The Groke
server exposes all the modules and functions as a hierarchy of
resources. Such as:

    /module/function

The client can then POST any parameters (JSON encoded) into that
resource and the Groke server will execute the function and return the
value in the HTTP response body (again, JSON encoded). Should the
return value be an object or a function, the implementation stays on
the server and only the description is transferred over the wire.

A thin client side wrapper automatically handles the networking
details and also stubbing of the interfaces returned by the
server. Client application can thus make invocations like:

    var file = require("file");
    // implementation of 'f' stays on server
    var f = file.open("myfile.txt", "w");
    f.write("hello groke");
    f.flush();
    f.close();

This would translate into series of HTTP POSTs to /file/open, 
/objec/{obj-id}/write, /objec/{obj-id}/flush and /objec/{obj-id}/close 
resources.

When a client side application (a .js file) is originally loaded into
the browser, the Groke server intercepts the request and performs
necessary inspection and instrumentation on the code. Only after that
the javascript source code is returned to the browser. By doing so,
the Groke server replaces all remote objects and function calls with
HTTP requests to resources exposed by the server.



Installation
============

Clone the Groke source under narwhal/packages and add symlink to
narwhal/bin.

    cd narwhal/packages
    git clone ...
    cd ../bin
    ln -s ../packages/groke/bin/groke



Todo
====

- port the startup script to Windows
- garbage collection
- make the platform symmetric by utilizing Comet or WebSockets
    - i.e. server should be able to call clients functions too
- proper XMLHttpRequest
- tests are not working
- make client side wrapper cacheable
