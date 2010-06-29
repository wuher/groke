/*
 * 8.4.2009 jedi
 *
 * test the application loader
 */

/*jslint onevar: true, undef: true, eqeqeq: true, nomen: true,
 plusplus: true, bitwise: true, newcap: true, rhino: true */
/*global Packages groke exports */


var loadapp = groke.require('apploader').loadFile;

exports.basic = function () {
    var code, out, i;

    // testapp1 --> generated1
    code = loadapp('test/testapps/testapp1.js');
    out = new Packages.java.io.PrintWriter(
        Packages.java.io.FileWriter('generated1.js'));
    out.write(code);
    out.close();
    test.assertMatch(code, 'groke.modules.db');
    test.assertMatch(code, 'connect: function()');
    test.assertMatch(code, 'query: function()');
    test.assertMatch(code, 'getSingle: function()');
    test.assertMatch(code, 'groke.ajax =');
    test.assertMatch(code, 'groke.marshalParameters =');
    test.assertMatch(code, "'\/groke\/module\/db\/disconnect'");
    test.assertMatch(code, 'deathstar');
    // only once
    i = code.indexOf('groke.modules.db = {');
    test.assertTrue(i > 0);
    test.assertTrue(code.indexOf('groke.modules.db = {', i + 1) == -1);


    // testapp2 --> generated2
    code = loadapp('test/testapps/testapp2.js');
    out = new Packages.java.io.PrintWriter(
        Packages.java.io.FileWriter('generated2.js'));
    out.write(code);
    out.close();
    test.assertMatch(code, 'groke.modules.db');
    test.assertMatch(code, 'groke.modules.logging');
    test.assertMatch(code, 'connect: function()');
    test.assertMatch(code, 'query: function()');
    test.assertMatch(code, 'getSingle: function()');
    test.assertMatch(code, 'groke.ajax =');
    test.assertMatch(code, 'groke.marshalParameters =');
    test.assertMatch(code, 'deathstar');
    // only once
    i = code.indexOf('groke.modules.db = {');
    test.assertTrue(i > 0);
    test.assertTrue(code.indexOf('groke.modules.db = {', i + 1) == -1);
};


exports.browser = function () {
    // testapp3 --> generated3
    var code, out;

    code = loadapp('test/testapps/testapp3.js');
    out = new Packages.java.io.PrintWriter(
        Packages.java.io.FileWriter('generated3.js'));
    out.write(code);
    out.close();
    test.assertMatch(code, "groke\.require.*browser");
    test.assertMatch(code, "dojox\.cometd");
};
