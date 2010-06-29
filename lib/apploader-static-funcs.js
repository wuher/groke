/*
 * static functions for groke-client
 */


// todo: add check that this file can't be required in the server

if (typeof Function.curry !== 'function') {
    Function.prototype.curry = function () {
        var slice, args, that;

        slice = Array.prototype.slice;
        args = slice.apply(arguments);
        that = this;

        return function () {
            return that.apply(null, args.concat(slice.apply(arguments)));
        };
    };
}


(function () {
     if (typeof groke === 'undefined') {
         groke = {};
     }
     if (!groke.modules) {
         groke.modules = {};
     }
     if (typeof require === 'undefined') {
         require = function (module) {
             return groke.modules[module];
         };
     }
 })();


groke.handleResponse = function (response) {
    switch(response.type) {
    case 'value':
        return response.data;
    case 'function': break; /* todo */
    case 'object':
        var i, funcname, propname, ret = {};
        for (i = 0; i < response.data[0].length; i += 1) {
            propname = response.data[0][i];
            ret.__defineGetter__(
                propname,
                function (propname) {
                    return groke.ajax(groke.uriPrefixes.objects +
                                      response.resid + '/' + propname,
                                      groke.marshalParameters([]));
                }.curry(propname));
        }
        for (i = 0; i < response.data[1].length; i += 1) {
            funcname = response.data[1][i];
            ret[funcname] = function (funcname) {
                var args = Array.prototype.slice.call(arguments, 1);
                var callback = undefined;
                if (typeof args[args.length-1] === 'function') {
                    callback = args.pop();
                }
                groke.ajax(groke.uriPrefixes.objects +
                           response.resid + '/' + funcname,
                           groke.marshalParameters(args), callback);
            }.curry(funcname);
        }
        return ret;
    }

    if (response.exc_info) {
        throw new Error(response.exc_info);
    } else {
        throw new Error("unsopperted response type");
    }
};


groke.ajax = function (url, data, callback) {

    var request =  new XMLHttpRequest();
    if (callback) {
        request.open("POST", url, true);
        request.onreadystatechange = function () {
            var done = 4, ok = 200;
            if (request.readyState === done && request.status === ok) {
                try{
                    callback(
                        groke.handleResponse(JSON.parse(request.responseText)));
                } catch (e) {
                    // todo
                    console.log(e);
                }
            }
        };
    } else {
        request.open("POST", url, false);
    }
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(data);

    if (!callback) {
        // todo: better error handling
        return groke.handleResponse(JSON.parse(request.responseText));
    }
};


/// marshals given parameters into a json string
/// expects args to be a real array
groke.marshalParameters = function (args) {
    var i, json = {};

    json.parameters = args;

    // convert into json string
    return JSON.stringify(json);
};


groke.uriPrefixes = {
    staticFiles: '/static/',
    functions: '/groke/function/',
    objects: '/groke/object/',
    modules: '/groke/module/',
    ctors: '/groke/ctor/',
    apps: '/groke/app/'
};


if(!this.JSON){JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
            if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return this.getUTCFullYear()+'-'+
                                                                                              f(this.getUTCMonth()+1)+'-'+
                                                                                              f(this.getUTCDate())+'T'+
                                                                                              f(this.getUTCHours())+':'+
                                                                                              f(this.getUTCMinutes())+':'+
                                                                                              f(this.getUTCSeconds())+'Z';};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
            var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
            function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
                                     if(typeof rep==='function'){value=rep.call(holder,key,value);}
                                     switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
                                                          gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
                                                                                                                                               v=partial.length===0?'[]':gap?'[\n'+gap+
                                                                                                                                               partial.join(',\n'+gap)+'\n'+
                                                                                                                                               mind+']':'['+partial.join(',')+']';gap=mind;return v;}
                                                          if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
                                                          v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
                                                          mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
            if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
                                                                                                 rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
                                                                                                 return str('',{'':value});};}
            if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
                                                                                                                 return reviver.call(holder,key,value);}
                                                                                 cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
                                                                                                                                                   ('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
                                                                                 if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
                                                                                                                      throw new SyntaxError('JSON.parse');};}})();
