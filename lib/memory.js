// -*- coding: utf-8 -*-
//memory.js ---
//
// Copyright (C) MIT License
// Tampere University of Technology
//
// Created: Tue Jun 29 09:09:22 2010 (+0300)
// Author: jedi
//
//
//


var objectResources = {};


var nextObjectId = function () {
    var count = 0;
    return function () {
        return ++count;
    };
}();


exports.getObject = function (id) {
    return objectResources(id);
};


exports.storeObject = function (obj) {
    var id = nextObjectId();
    objectResources[id] = obj;
    return id;
};


exports.releaseObject = function (id) {
    delete objectResources[id];
};


//
//memory.js ends here