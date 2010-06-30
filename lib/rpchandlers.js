// -*- coding: utf-8 -*-
//rpchandlers.js ---
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



var gutil = require("grokeutil");
var apploader = require("apploader");
var log = require("system").log;
var mem = require("memory");
var sprintf = require("printf").sprintf;


/**
 * Execute a function of a module
 */
exports.executeModuleFunction = function (funcuri, params) {
    var uriparts, module;

    // split the uri into module and function names
    uriparts = gutil.uri2modAndFunc(funcuri);
    // require the module based on the name
    module = require(uriparts[0]);

    // make the function call
    return module[uriparts[1]].apply(module, params);
};


/**
 * Execute a function or return a property of an in-memory object
 */
exports.executeObjectFunction = function (methoduri, params) {
    var methodparts, obj;

    methodparts = methoduri.split('/');
    obj = mem.objects.lookup(new Number(methodparts[0]));

    // todo: add util.is(obj, ret) check to avoid multiple copies in 'memory'

    if (typeof obj[methodparts[1]] === "function") {
        return obj[methodparts[1]].apply(obj, params);
    } else {
        // params should be empty
        if (params.length !== 0) {
            log.warn(sprintf("params '%s' given to object property '%s'", params, methoduri));
        }
        return obj[methodparts[1]];
    }
};


/**
 * Execute an anonymous function
 */
exports.executeAnonymousFunction = function (func, params) {
    log.debug("func: " + func + " called with params: " + params);
    func = mem.functions.lookup(new Number(func));
    return func.apply(null, params);
};


/**
 * Creates and returns new object
 */
exports.executeConstructor = function (ctoruri, params) {
    var uriparts, module, newo, ctor;

    // split the uri into module and function names
    uriparts = gutil.uri2modAndFunc(ctoruri);
    // require the module based on the name
    module = require(uriparts[0]);

    // create the object
    newo = new module[uriparts[1]]();

    ctor = module[uriparts[1]].prototype.constructor;
    if (typeof ctor === "function") {
        return ctor.apply(newo, params) || newo;
    } else {
        return newo;
    }
};


//
//rpchandlers.js ends here
