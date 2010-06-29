/*
 * 8.4.2009 jedi
 *
 * test utilities
 */

/*jslint onevar: true, undef: true, eqeqeq: true, forin: true,
 plusplus: true, bitwise: true, newcap: true, evil: true */
/*global exports groke test */


var util = require('grokeutil');
var assert = require("assert");


exports.testDateTime = function () {
    var d = util.datetime();
    d.setTime(0);
    assert.equal(d.getTimeStr(), '1970-01-01 02:00:00:000', 'setTime(0)');
    d.resetTime();
    assert.notEqual(d.getTimeStr(), '1970-01-01 02:00:00:000', 'resetTime()');
};


exports.testGlobal = function () {
    var p, globs, global, arr = require('util').array;

    global = util.getGlobalScope();
    globs = ["system", "print", "require", "installed"];

    for (p in global) {
        if (!arr.has(globs, p)) {
            assert.fail(p + " shouldn't be in global scope");
        }
    }

    for (p in globs) {
        if (arr.has(global, p)) {
            assert.fail(p + " should be in global scope");
        }
    }
};


exports.testIsArray = function () {
    assert.ok(util.isArray([]));
    assert.ok(util.isArray([3]));
    assert.ok(util.isArray([3, 'h']));
    assert.ok(!util.isArray());
    assert.ok(!util.isArray(3));
    assert.ok(!util.isArray({}));
};


exports.testObjectEquality = function () {
    assert.ok(util.isEqual());
    assert.ok(util.isEqual(3, 3));
    assert.ok(util.isEqual('', ''));
    assert.ok(util.isEqual('jedi', 'jedi'));
    assert.ok(!util.isEqual('-jedi', 'jedi'));
    assert.ok(util.isEqual(false, false));
    assert.ok(util.isEqual(true, true));
    assert.ok(!util.isEqual(false, true));
    assert.ok(!util.isEqual(true, 1));
    assert.ok(!util.isEqual(1, true));
    assert.ok(!util.isEqual(1, false));
    assert.ok(!util.isEqual(0, false));
    assert.ok(!util.isEqual('', false));
    assert.ok(!util.isEqual(false, ''));
    assert.ok(util.isEqual([], []));
    assert.ok(util.isEqual({}, {}));
    assert.ok(!util.isEqual({}, []));
    assert.ok(!util.isEqual([], {}));
    assert.ok(!util.isEqual({id: 3}, {id: 3, pid: [2]}));
    assert.ok(util.isEqual({id: 3, pid: [2]}, {id: 3, pid: [2]}));
    assert.ok(util.isEqual([{id: 3, k: {s: '3'}}, [3, 3, []]],
                                 [{id: 3, k: {s: '3'}}, [3, 3, []]]));
    assert.ok(!util.isEqual([{id: 3, k: {s: '3'}}, [3, 3, ['']]],
                                  [{id: 3, k: {s: '3'}}, [3, 3, []]]));
    assert.ok(!util.isEqual(function () {}, function () {}));
};


if (require.main == module.id) {
    require("os").exit(require("test/runner").run(exports));
}
