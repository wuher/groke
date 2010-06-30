// -*- coding: utf-8 -*-
//middleware.js ---
//
// Copyright (C) MIT License
// Tampere University of Technology
//
// Created: 27.3.2010
// Author: wuher
//
//
//


/*jslint onevar: true, white: true, undef: true, eqeqeq: true,
 plusplus: true, bitwise: true, newcap: true, evil: true */
/*global require exports */



var Jack = require("jack");
var file = require("file");
var util = require("util");
var gutil = require("grokeutil");
var utils = require("jack/utils");
var mime = require("jack/mime");
var log = require("system").log;
var mem = require("memory");


/**
 * middleware for jack to invoke correct function of an app based on the
 * request method.
 */
exports.methodist = function (app) {
    return function (req) {
        var method = new Jack.Request(req).requestMethod().toLowerCase();
        if (typeof app[method] === "function") {
            return app[method](req);
        } else {
            return {
                status: 405,
                headers: {"Content-Type": "text/plain"},
                body: []
            };
        }
    };
};



/**
 *
 */
exports.rpc = function (app) {

    var formatResult = function (data) {
        var id, p, tmpdata = [], result = {};

        result.data = data;
        result.isUndefined = (data === undefined);
        result.isNan = (isNaN(data));
        result.isNull = (data === null);
        result.type = "value";

        if (result.isUndefined) {
            // noop
        } else if (util.isArrayLike(result.data)) {
            // make sure it's a proper array
            result.data = util.array.coerce(result.data);
        } else if (typeof result.data === "object" &&
                   (!(result.data instanceof Number)) &&
                   (!(result.data instanceof String)) &&
                   (!(result.data instanceof Boolean))) {
            id = mem.objects.store(result.data);
            result.type = "object";
            result.resid = id;
            tmpdata.push(gutil.getProperties(result.data));
            tmpdata.push(gutil.getFunctions(result.data));
            result.data = tmpdata;
        } else if (typeof result.data === "function") {
            id = mem.functions.store(result.data);
            result.type = "function";
            result.resid = id;
            result.data = null;
        }

        return JSON.stringify(result);
    };

    return function (req) {
        var params,
        result,
        request = new Jack.Request(req),
        uri = new Jack.Request(req).pathInfo();

        // trim out slashes
        uri = gutil.trimslash(uri);

        // parse function parameters
        params = JSON.parse(request.body().decodeToString()).parameters;
        result = app(req, uri, params);
        log.debug(uri + " invoked with " + params + " and returned " + result);

        return {
            status: 200,
            headers: {"Content-Type": "application/json"},
            body: [formatResult(result)]
        };
    };
};



/**
 *
 */
exports.catchall = function (app) {

    // function ripped from narwhal's test/runner
    function getBacktrace(e) {
        if (!e) {
            return "";
        }
        else if (e.rhinoException) {
            var s = new Packages.java.io.StringWriter();
            e.rhinoException.printStackTrace(new Packages.java.io.PrintWriter(s));
            return String(s.toString());
        }
        else if (e.javaException) {
            var s = new Packages.java.io.StringWriter();
            e.javaException.printStackTrace(new Packages.java.io.PrintWriter(s));
            return String(s.toString());
        }
        return "";
    }

    return function (req) {
        try {
            return app(req);
        } catch (e) {
            var backtrace = getBacktrace(e);

            log.error("rpc error: " + e);
            log.error(backtrace);

            return {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: [
                    JSON.stringify({data: undefined, exc_info: e.toString()})
                ]
            };
        }
    };
};


/**
 * serves static files
 */
exports.staticfiles = function (uri, root) {
    return function (req) {
        var contents, path, reqpath;

        req = new Jack.Request(req);
        reqpath = req.pathInfo();

        try {
            path = file.absolute(file.join(root, reqpath));
            print("path: " + path);
            if (file.isFile(path) && file.isReadable(path)) {
                contents = file.read(path, { mode : "b" });
                if (contents) {
                    return {
                        status : 200,
                        headers : {
                            "Last-Modified": file.mtime(path).toUTCString(),
                            "Content-Type": mime.mimeType(file.extension(path), "text/plain"),
                            "Content-Length": String(contents.length)
                        },
                        body : [contents]
                    };
                }
            }
        } catch (e) {
            req.jsgi.errors.print("error: " + e);
            return utils.responseForStatus(500);
        }

        // todo: all errors are now 404
        return utils.responseForStatus(404);
    };
};

//
//middleware.js ends here
