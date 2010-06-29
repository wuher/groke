/*
 * 9.4.2009 jedi
 *
 * testing http module
 */

/*jslint onevar: true, undef: true, eqeqeq: true, nomen: true,
 plusplus: true, bitwise: true, newcap: true, rhino: true */
/*global Packages exports groke test */


var http = groke.require('http');

exports.response = function () {
    var responseMock, writerMock, response;

    // create two mocks
    responseMock = test.mock(
        new Packages.org.mortbay.jetty.Response(null));
    writerMock = test.mock({close: function () {}, write: function () {}});

    // lay out the contract for the mocks
    responseMock.expect.setContentType().times(1).withParameters('text/plain');
    responseMock.expect.setStatus().times(1).withParameters(200);
    responseMock.expect.getWriter().times(1).returns(writerMock);
    writerMock.expect.write().times(1).withParameters('hiihoo');
    writerMock.expect.close().times(1);

    // test the response object
    response = http.response(responseMock);
    response.setHeaders({status: 200, contentType: 'text/plain'});
    response.setContent('hiihoo');
};


exports.request = function () {
    var requestMock, readerMock, request;

    // create two mocks
    requestMock = test.mock(
        new Packages.org.mortbay.jetty.Request());
    readerMock = test.mock({readLine: function () {},
                                close: function () {}});

    // lay out the contract for the mocks
    requestMock.expect.setHandled().times(1).withParameters(true);
    requestMock.expect.getPathInfo().times(1);
    requestMock.expect.getReader().times(1).returns(readerMock);
    readerMock.expect.readLine().times(-1).returns('hiihoo').returns(null);
    readerMock.expect.close().times(1);

    // test the request object
    request = http.request(requestMock);
    request.setHandled(true);
    request.getPathInfo();
    test.assertEquals('hiihoo\n', request.getContent());
};
