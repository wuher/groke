/*
 * 8.4.2009 jedi
 *
 * utilities
 */


/**
 * @todo combine with getFunctions()
 *
 * @param module name of the module or the module itself that is used
 * by the loaded application
 * @return array of names of all the properties in the module
 */
exports.getProperties = function (module) {
    var o, props = [];

    if (typeof module === "string") {
        module = require(module);
    }

    for (o in module) {
        if (/*module.hasOwnProperty(o) &&*/
            typeof module[o] !== "function") {
            props.push(o);
        }
    }
    return props;
};



/**
 * @todo combine with getProperties()
 *
 * @param module name of the module or the module itself that is used
 * by the loaded application
 * @return array of names of all the functions in the module
 */
exports.getFunctions = function (module) {
    var o, funcs = [];

    if (typeof module === "string") {
        module = require(module);
    }

    for (o in module) {
        if (/*module.hasOwnProperty(o) &&*/
            typeof module[o] === "function") {
            funcs.push(o);
        }
    }
    return funcs;
};
