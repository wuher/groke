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



var apploader = require("apploader");
var log = require("system").log;
var mem = require("memory");



/**
 * Execute a function of a module.
 */
exports.executeModuleFunction = function (funcuri, params) {
    var methodparts, modname, funcname, module, id;

    // todo: so far, supports only one level of modules
    methodparts = funcuri.split('/');
    modname = "" + methodparts[0];
    funcname = "" + methodparts[1];

    // require the module based on the name
    module = require(modname);

    // make the function call
    return module[funcname].apply(module, params);
};


/**
 * Execute a function of an in-memory object
 */
exports.executeObjectFunction = function (methoduri, params) {
    var methodparts, funcname, obj;

    methodparts = methoduri.split('/');

    funcname = "" + methodparts[1];
    obj = mem.objects.lookup(new Number(methodparts[0]));

    // todo: add util.is(obj, ret) check to avoid multiple copies in 'memory'

    return obj[funcname].apply(obj, params);
};


/**
 * Execute an anonymous function
 */
exports.executeAnonymousFunction = function (func, params) {
    func = mem.functions.lookup(new Number(func));
    return func.apply(null, params);
};


//
//rpchandlers.js ends here
