// -*- coding: utf-8 -*-
//rpchandlers.test.js ---
//
// Copyright (C) MIT License
// Tampere University of Technology
//
// Created: Wed Jun 30 07:58:29 2010 (+0300)
// Author: jedi
//
//
//


var rpc = require("rpchandlers");
var assert = require("test/assert");
var util = require("util");
var sprintf = require("printf").sprintf;
var mem = require("memory");


util.forEachApply(
    [
        ["grokeutil/trimslash", ["/heehaw/"], "heehaw"],
        ["test/assert/isSame", [1, 1], undefined]
    ],
    function (mod, params, exp) {
        exports[sprintf("testExecuteModuleFunction: %s(%s)", mod, params)] =
            function () {
                assert.isSame(exp, rpc.executeModuleFunction(mod, params));
            };
    });

exports.testExecuteObjectFunction = function () {
    var id, o = {dbl: function (val) {return val*2;}};;

    id = mem.objects.store(o);
    assert.isSame(4, rpc.executeObjectFunction(id + "/dbl", [2]));
};


exports.testExecuteAnonymousFunction = function () {
    var id, f = function (val) {return val*2;};

    id = mem.functions.store(f);
    assert.isSame(4, rpc.executeAnonymousFunction("" + id, [2]));
};


exports.testExecuteConstructor = function () {
    var o, xhr = require("browser/xhr");

    o = rpc.executeConstructor("browser/xhr/XMLHttpRequest", []);
    assert.isTrue(o !== null, "is null");
    assert.isTrue(o !== undefined, "is undefined");
    assert.isSame("object", typeof o);
    assert.isTrue(o instanceof xhr.XMLHttpRequest);
};


if (require.main == module.id) {
    require("test/runner").run(exports);
}



//
//rpchandlers.test.js ends here
