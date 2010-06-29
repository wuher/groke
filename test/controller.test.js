/*
 * 8.4.2009 jedi
 *
 * test controller
 */

/*jslint onevar: true, undef: true, eqeqeq: true, nomen: true,
 plusplus: true, bitwise: true, newcap: true, rhino: true */
/*global groke test exports */



var http = groke.require('http');
var handle = groke.require('controller').handle;
var log = groke.require('logging').log;
var db = groke.require('db');

// connect the database
db.connect();


var createUserTable =
    'create table username (' +
    'id int not null generated always as identity constraint user_pk primary key, ' +
    'username varchar(30) not null, ' +
    'password varchar(30) not null)';


var insertUser = 'insert into username (username, password) ' +
    'values (\'jedi\', \'jedi\')';


// initialize database
db.update(createUserTable);
db.insert({type: 'username',
           data: {username: 'groke',
                  password: 'groke'
                 }});
db.insert({type: 'username',
           data: {username: 'jedi',
                  password: 'jedi'
                 }});


exports.get_jedi_password = function () {

    var requestMock, responseMock;
    requestMock = test.mock(http.request(null));
    responseMock = test.mock(http.response(null));

    responseMock.expect.setHeaders().times(1).withParameters(
        {status: 200, contentType: 'application/jsonrequest'});
    requestMock.expect.setHandled().times(1).withParameters(true);
    requestMock.expect.getPathInfo().times(1).returns('/groke/module/db/getSingle');
    requestMock.expect.getContent().times(1).returns(
        '{"parameters":[{"type":"username","properties":["password"],"constraint"'+
            ':{"username":"jedi"}}]}');
    responseMock.expect.setContent().times(1).withParameters(
        '{"data":"jedi"}');

    handle(requestMock, responseMock);
};


exports.tearDown = function () {
    // drop username table
    try {
        db.update('drop table username');
    } catch (e1) {
    }

    // disconnect
    try {
        db.disconnect();
    } catch (e2) {
    }
};
