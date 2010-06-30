Groke
=====

Groke is a JavaScript server for the JavaScript client. It offers REST
inspired approach into RPC services. Groke can be though of as a
platform for hosting web applications that are implemented using
JavaScript on both sides of the Internet cloud. It simplifies the
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
/object/{obj-id}/write, /object/{obj-id}/flush and
/object/{obj-id}/close resources.

When a client side application (a .js file) is originally loaded into
the browser, the Groke server intercepts the request and performs
necessary inspection and instrumentation on the code. Only after that
the javascript source code is returned to the browser. By doing so,
the Groke server replaces all remote objects and function calls with
HTTP requests to resources exposed by the server.



History
=======

Groke started out as a research project in early 2008 to investigate
how to implement a platform for loading JavaScript applications into
the browser with minimum effort. It was first created to be used in
conjunction with the [Sun Labs Lively Kernel][1] and the [Lively][2]
(a research [group][3] that i'm part of) in general.

During its short lifecycle, Groke has already gone through several
generations and rewrites. The first version was built on top of the
[Phobos][4] project and had many Lively specific feature in it. The
next version was a bit more primitive in that it used Rhino and
embedded Jetty was started from the JavaScript manually with
appropriate request handlers. This version also supported various
Comet protocols making the platform bi-directional and collaborative.
This version was completed around the same time the CommonJS group was
emerged.

After following the CommonJS group for awhile I started to port the
platform to conform to that spec which wasn't actually too hard as I
had already implemented very similar module system in my previous
version of the platform. The hardest part was throwing away all that
code that was now part of the narwhal platform (only better tested and
with more features) :) In the third version, the idea of presenting
all the modules and function as hierarchy of resources was born. I
fought to overcome the REST-RPC mismatch to great extent but
eventually ended up with a compromise with which i wasn't too happy
with.

The third generation was free from all the Lively specific stuff but
it was still using manually embedded Jetty so it was time to move away
from that and employ Jack (loads of ugly code thrown away). Jack and
JSGI have a really nice API for implementing middleware components and
this was the major point of refactoring in the fourth version of
Groke. Also, the REST approach was re-though and implemented.



Installation
============

Clone the Groke source under narwhal/packages and add symlink to
narwhal/bin.

    cd narwhal/packages
    git clone http://github.com/wuher/groke.git
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



REST Discussion
===============

By default, the server side of the platform exposes all of its modules
and their exposed variables (may they be functions, objects or
properties) through a resource oriented interface. That is, the module
hierarchy is simply turned into a hierarchy of resources. For example,
the `list` function of the `file` module would respond
to resource name `file/list`. In order for a client to
actually invoke this function, it needs to send an HTTP POST request
to that URL with all the necessary parameters encoded as a JSON string
in the body of the request. At the time of writing, the platform also
has limited support for exposing objects and anonymous functions that
may be created dynamically as part of return values from various
operations. Following table summarizes the different types of
resources exposed by the platform.


<table>
  <tr>
    <th>
      Resource type
    </th>
    <th>
      URL scheme
    </th>
    <th>
      Example
    </th>
  </tr>
  <tr>
    <td>
       Functions provided by modules.
    </td>
    <td>
       `/groke/module/&lt;module&gt;/<function>`
    </td>
    <td>
       `/groke/module/file/list`
    </td>
  </tr>
  <tr>
    <td>
      “Constructor” functions, i.e. functions invoked with the new operator.
    </td>
    <td>
      `/groke/ctor/&lt;module&gt;/<function>`
    </td>
    <td>
      `/groke/ctor/file/File`
    </td>
  </tr>
  <tr>
    <td>
      Objects that are exposed as a return value of a function invocation.
    </td>
    <td>
      `/groke/obj/&lt;object-id&gt;/<property>`
    </td>
    <td>
      `/groke/obj/8327/write`
    </td>
  </tr>
  <tr>
    <td>
      Functions exposed as a return values. 
      This is analogous with the previous case.
    </td>
    <td>
      `/groke/func/&lt;function-id&gt;`
    </td>
    <td>
      `/groke/func/9284`
    </td>
  </tr>
</table>



The interface supports HTTP POST method only. Surely, this seems like
a violation to the rules of REST. However, the platform cannot have
any understanding about the modules and functions it exposes; it only
knows that it serves a set of operations as resources that clients may
invoke. Furthermore, these operations may require input parameters
which, by REST convention, are POSTed to these operations. Modules and
functions as resources also have a static nature in that they cannot
be explicitly created, replaced or deleted using the methods of
HTTP. Although, as suggested by the above Table, new objects and
functions can be created and exposed dynamically but it is always more
or less a side effect of a function invocation issued with HTTP's POST
method.

Another controversy is presenting functions as resources. Albeit, the
REST guidelines define that a resource can be anything, I do realize
that presenting functions as resources makes the interface seem more
like an RPC type of service. In the REST world it is highly
discouraged to use verbs as the names of resources and this is what
inevitably happens when exposing functions as resources. On the other
hand this is not the platform's choice, the names of the resources are
unknown to the platform when the system starts, everything is exposed
dynamically and therefore also the names of the resources are chosen
by the programmers providing the operations.

Because of these conflicting aspects I feel that it is not justified
to call the interface RESTful but something that is inspired by REST.



[1]:http://labs.oracle.com/projects/lively/
[2]:http://lively.cs.tut.fi/
[3]:http://lively.cs.tut.fi/people.html
[4]:https://phobos.dev.java.net/
