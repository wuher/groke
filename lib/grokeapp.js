// -*- coding: utf-8 -*-
//grokeapp.js ---
//
// Copyright (C) MIT License
// Tampere University of Technology
//
// Created: 27.3.2010
// Author: wuher (jedi@cs.tut.fi)
//
//
//


/*jslint onevar: true, white: true, undef: true, eqeqeq: true,
 plusplus: true, bitwise: true, newcap: true, evil: true */
/*global require exports */


var Jack = require("jack");
var grokedirs = require("globals").directories;
var uriPrefixes = require("globals").uriPrefixes;
var methodist = require("middleware").methodist;
var rpc = require("middleware").rpc;
var catchall = require("middleware").catchall;
var staticfiles = require("middleware").staticfiles;
var log = require("system").log;
var rpchandlers = require("rpchandlers");
var loadapp = require("apploader").loadFile;
var file = require("file");


var map = {};


grokedirs.appsDir = system.fs.cwd();
grokedirs.staticDir = system.fs.cwd();
grokedirs.libDir = file.dirname(module.path);


/**
 * Loads a module into the browser. Read the file from disk,
 * instrument it and return in the body.
 */
map[uriPrefixes.apps] =
    methodist(
        {
            get: function (req) {
                var appfile, appcode, uri = new Jack.Request(req).pathInfo();

                appfile = new file.Path(grokedirs.appsDir);
                appfile = appfile.join(uri);
                log.info("loading application in " + appfile);
                appcode = loadapp(appfile);

                return {
                    status: 200,
                    headers: {"Content-Type": "text/javascript"},
                    body: [appcode]
                };
            }
        });


/**
 * Invoke a function of a module.
 */
map[uriPrefixes.modules] =
    methodist(
        {
            post: catchall(
                rpc(
                    function (req, uri, params) {
                        return rpchandlers.executeModuleFunction(uri, params);
                    }))
        });


/**
 * Invoke a function of an object.
 */
map[uriPrefixes.objects] =
    methodist(
        {
            post: catchall(
                rpc(
                    function (req, uri, params) {
                        var result;
                    }))
        });


map[uriPrefixes.staticFiles] = staticfiles(uriPrefixes.staticFiles,
                                           grokedirs.staticDir);


// configure logging
(function () {
     var logg = require("logger");
     log.level = logg.Logger.DEBUG;
     log.format = function (severity, args) {
         return "[" + logg.Logger.SEV_LABEL[severity] + "] " +
             Array.prototype.join.apply(args, [" "]);
     };
 })();


exports.app = Jack.ContentLength(Jack.URLMap(map));

//
//grokeapp.js ends here
