// -*- coding: utf-8 -*-
//util.test.js ---
//
// Copyright (C) MIT License
// Tampere University of Technology
//
// Created: Tue Jun 29 14:48:36 2010 (+0300)
// Author: wuher (jedi@cs.tut.fi)
//
//
//



var nutil = require("util");
var util = require('grokeutil');
var assert = require("test/assert");


nutil.forEachApply(
    [
        ["", ""]
        , ["/", ""]
        , ["///", ""]
        , ["/hii", "hii"]
        , ["hoo/", "hoo"]
        , ["/hiihoo/", "hiihoo"]
    ],
    function (given, expected) {
        exports["testTrimslash: " + given] = function () {
            assert.isSame(expected, util.trimslash(given));
        };
    });


if (require.main == module.id) {
    require("test/runner").run(exports);
}


//
//util.test.js ends here
