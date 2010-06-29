// -*- coding: utf-8 -*-
//memory.test.js ---
//
// Copyright (C) MIT License
// Tampere University of Technology
//
// Created: Tue Jun 29 21:25:20 2010 (+0300)
// Author: jedi
//
//
//

var mem = require("memory");
var assert = require("test/assert");

var o1 = {}, o2 = {};
var f1 = function () {}, f2 = function () {};

exports.testBothStores = function () {
    assert.isSame(1, mem.objects.store(o1));
    assert.isSame(1, mem.functions.store(f1));
    assert.isSame(2, mem.objects.store(o2));
    assert.isSame(2, mem.functions.store(f2));

    assert.is(o1, mem.objects.lookup(1));
    mem.objects.release(1);
    assert.isTrue(mem.objects.lookup(1) === undefined);

    assert.is(f1, mem.functions.lookup(1));
    mem.functions.release(1);
    assert.isTrue(mem.functions.lookup(1) === undefined);

    assert.is(o2, mem.objects.lookup(2));
    mem.objects.release(2);
    assert.isTrue(mem.objects.lookup(2) === undefined);

    assert.is(f2, mem.functions.lookup(2));
    mem.functions.release(2);
    assert.isTrue(mem.functions.lookup(2) === undefined);
};


if (require.main == module.id) {
    require("test/runner").run(exports);
}


//
//memory.test.js ends here
