// -*- coding: utf-8 -*-
//memory.js ---
//
// Copyright (C) MIT License
// Tampere University of Technology
//
// Created: Tue Jun 29 09:09:22 2010 (+0300)
// Author: wuher (jedi@cs.tut.fi)
//
//
//


var idGenerator = function () {
    return function () {
        var count = 0;
        return function () {
            return ++count;
        };
    }();
};


var store = function () {
    var idgen = idGenerator(), resources = {}, that = {};

    that.lookup = function (id) {
        return resources[id];
    };

    that.store = function (o) {
        var id = idgen();
        resources[id] = o;
        return id;
    };

    that.release = function (id) {
        delete resources[id];
    };

    return that;
};


exports.objects = store();
exports.functions = store();


//
//memory.js ends here
