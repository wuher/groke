// -*- coding: utf-8 -*-
// Copyright (C) MIT License
// Tampere University of Technology

/*
 * 13.4.2009 wuher (jedi@cs.tut.fi)
 *
 * application loader for programs to be sent to the browser
 *
 * todo:
 *
 *  - support for importing module properties (e.g. http.STATUS_OK)
 *  - support for importing functions that aren't at the top level
 *    in the module
 *  - sometimes it would be useful to pull functions into the browser
 *    (e.g. some of the util-functions)
 *
 */

/*jslint onevar: true, white: true, undef: true, eqeqeq: true,
 plusplus: true, bitwise: true, newcap: true, evil: true */
/*global require exports */


var moduleUrlPrefix = require("globals").uriPrefixes.modules;
var ctorUrlPrefix = require("globals").uriPrefixes.ctors;
var grokedirs = require("globals").directories;


/// regexp to match all require invocations
var requireMatch = /require\s*\(\s*(?:"|')(.*)(?:'|")\s*\)/g;


var log = require("system").log;
var util = require("util");
var file = require("file");
var gutil = require("grokeutil");



/**
 * @return array containing all required modules by the given code
 */
var getRequiredModules = function (appcode) {
    var result, requiredModules;

    requiredModules = [];
    while ((result = requireMatch.exec(appcode)) !== null) {
        // include any module only once
        if (!util.array.has(requiredModules, result[1])) {
            requiredModules.push(result[1]);
        }
    }
    return requiredModules;
};



/**
 * @param module name of the module that is used by the loaded application
 * @param functions list of the functions that the module has
 * @return generated code
 */
var generateStub = function (module, functions) {
    var i, modulepath, mod, code = "";

    modulepath = module.split("/");

    mod = "groke.modules";
    for (i = 0; i < modulepath.length; i += 1) {
        mod += "." + modulepath[i];
        code += "if (typeof " + mod + " === 'undefined') {\n";
        code += "    " + mod + " = {};\n";
        code += "}\n\n";
    }

    code += mod + " = {\n";

    for (i = 0; i < functions.length; i += 1) {
        code += "    " + functions[i] + ": function () {\n";
        code += "        var args = Array.prototype.slice.apply(arguments);\n";
        code += "        var callback = undefined;\n";
        code += "        if (typeof args[args.length-1] === 'function') {\n";
        code += "            callback = args.pop();\n";
        code += "        }\n";
        code += "        if (this instanceof arguments.callee) {\n";
        code += "            return groke.ajax('" + ctorUrlPrefix +
            module + "/" + functions[i] +
            "\', groke.marshalParameters(args), callback);\n";
        code += "        } else {\n";
        code += "            return groke.ajax('" + moduleUrlPrefix +
            module + '/' + functions[i] +
            "', groke.marshalParameters(args), callback);\n";
        code += "        }\n";
        code += "    }";
        if (i < (functions.length - 1)) {
            code += ",";
        }
        code += "\n";

    }
    code += "};\n";

    return code;
};



/**
 * loads and instruments the application in the given file
 * @return the code that can be sent to browser
 */
exports.loadFile = function (filename) {
    var originalCode, modules, i, instrumentedCode;

    log.debug("loading " + filename);
    // get the original code from the file
    originalCode = file.read(filename);
    if (originalCode === "") {
        throw new Error("file not found: " + filename);
    }
    // grep all required modules from the file
    modules = getRequiredModules(originalCode);
    // start gathering the instrumented code, add the common stuff first
    instrumentedCode = file.read(file.join(grokedirs.libDir, "apploader-static-funcs.js"));
    instrumentedCode += "\n\n";
    // go through all required modules, find their functions and generate
    // stubs to 'instrumentedCode'
    for (i = 0; i < modules.length; i += 1) {
        instrumentedCode += generateStub(modules[i],
                                         gutil.getFunctions(modules[i]));
    }
    instrumentedCode += "// ---------------------------------------------\n";
    instrumentedCode += originalCode;
    return instrumentedCode;
};



