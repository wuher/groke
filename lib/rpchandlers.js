/*
 * 27.3.2010 jedi
 *
 * rpc handlers
 */

/*jslint onevar: true, white: true, undef: true, eqeqeq: true,
 plusplus: true, bitwise: true, newcap: true, evil: true */
/*global require exports */

var apploader = require('apploader');
var log = require('system').log;


/**
 *
 */
exports.executeModuleFunction = function (methoduri, params) {
    var methodparts, modname, funcname, module, id;

    // take out the starting /
    if (methoduri.indexOf("/") === 0) {
        methoduri = methoduri.substring(1);
    }

    // todo: so far, supports only one level of modules
    methodparts = methoduri.split('/');
    modname = "" + methodparts[0];
    funcname = "" + methodparts[1];

    // require the module based on the name
    module = require(modname);

    // make the function call
    return module[funcname].apply(module, params);
};


