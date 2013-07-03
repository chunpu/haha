var http = require('http');
var url = require('url');
var utils = require('./utils.js');
var response = require('./response.js');
var request = require('./request.js');
var setting = require('./setting.js');
var Route = require('./route.js');

var proto = {};

['use', 'all', 'get', 'post', 'head', 'put', 'delete'].forEach(function(method) {

  proto[method] = function(pathname, fn) {

    if (method === 'get' && arguments.length === 1 && typeof pathname === 'string') {
      return setting[pathname];
    }

    if (!fn) {
      fn = pathname;
    }


    if (typeof pathname !== 'string' && !(pathname instanceof RegExp)) {
      pathname = '*';
    }

    var route = new Route(pathname);

    if (method === 'all' || method === 'use') {
      method = 'ALL';
    }

    this.stack.push({
      pathname: pathname,
      fn: fn,
      route: route,
      method: method.toUpperCase()
    });
  }

});

proto.showRoute = function() {
  for (var i = 0, layer; layer = this.stack[i]; i++) {
    console.log(layer.pathname, layer.route, layer.method);
  }
}

proto.handle = function(req, res, next) {

  var stack = this.stack;
  var index = 0;

  var method = req.method;
  var pathname = url.parse(req.url).pathname;
  req.pathname = pathname;

  tryMatch();

  function tryMatch() {

    var flag = false;

    if (index === stack.length) {
      // nothing
      res.writeHead(404);
      res.end("404 not found");
      return;
    }
    var layer = stack[index++];

    if ( (layer.method === 'ALL' || method === layer.method) && layer.route.test(pathname)) {
      // check pass
      
      utils.merge(res, response); // add more function to response
      utils.merge(req, new request(req)); // may be fixed

      res.jsonp = function(callbackname, obj) {
        // lie on req
        if (obj === undefined) {
          obj = callbackname;
          callbackname = 'callback';
        }
        var functionname = req.query[callbackname];
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        try {
          var output = functionname + '(' + JSON.stringify(obj) + ')';
        } catch(e) {
          var output = 'wrong obj type';
        }
        res.end(output);
      }

      req.params = layer.route.getParams(pathname);
      layer.fn(req, res, tryMatch);
      return;
     
    }

    tryMatch();

  }
}

proto.listen = function() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments); // cannot understand
}

// global setting
proto.disable = function(k) {
  delete setting[k]; // not false like express
  return this;
}

proto.enabled = function(k) {
  if (k in setting) {
    return true;
  }
  return false;
}

proto.disabled = function(k) {
  if (k in setting) {
    return false;
  }
  return true;
}

proto.enable = function(k) {
  setting[k] = true;
  return this;
}

proto.set = function(k, v) {
  //console.log(v);
  if (v === undefined) {
     this.enable(k);
     return this;
  }
  setting[k] = v;
  return this;
}

// configure

proto.configure = function(p0) {
  var cb = arguments[arguments.length-1];
  if (typeof cb !== 'function') {
    throw new TypeError('last argument should be function');
  }

  var envFlag = false;
  if (typeof p0 === 'string') {
    envFlag = this.get(p0);
  } else if (p0 === cb) {
    envFlag = true;
  }
  
  if (envFlag) {
    cb();
    return this;
  }
  
}

module.exports = proto;

