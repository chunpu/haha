var http = require('http');
var url = require('url');
var utils = require('./utils.js');
var response = require('./response.js');
var setting = require('./setting.js');

var proto = {};

proto.use = function(route) {
  var fn = arguments[arguments.length-1];
  var p = route;
  if (arguments.length === 1) {
    route = '/';
  }
  this.stack.push({
    pathname: p,
    fn: fn
  });

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

    if (!('method' in layer)) {
      // middleware
      flag = true;
    }

    if (method === layer.method && !flag) {
      var p = layer.pathname;
      if (p instanceof RegExp) {
        // regExp
        if (pathname.match(p)) {
          flag = true;
        }

      } else if (typeof p === 'string') {

        // str
        var _arr = p.split(':');
        var params = {};
        if (_arr.length === 1 && pathname === p) {
          // normal pathname
          flag = true;
        } else if (_arr.length > 1) {
          // path width params

          var regStr = p.replace(/:\w+/g, "(\\w+)");
          var meta = "[]{}^$|*.?", metaStr = '([';
          for (var i = 0; i < meta.length; i++) {
            metaStr += "\\"+meta[i];
          }
          metaStr += '])';
          
          //console.log(metaStr);
          //console.log(regStr);
          regStr = regStr.replace(new RegExp(metaStr, 'g'), "\\$1");
          //console.log(regStr);
          var reg = new RegExp(regStr);

          var _reg = new RegExp(':\\w+', 'g');
          //console.log(reg);
          var keys = p.match(_reg);
          //console.log(params);
          var result = pathname.match(reg); // result
          //console.log(result);

          if (keys.length > 0 && result && result.length > 0) {
            for (var i = 0; i < keys.length; i++) {
              var k = keys[i].substring(1, keys[i].length);
              params[k] = result[i+1];
            }
            flag = true;
            //console.log(obj);
            
          }
        }
      }


    } 

    if (flag === true) {
      //console.log(pathname, params);
      utils.merge(res, response); // add more function to response
      req.params = params;
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

proto.set = function(k, v) {
  setting[k] = v;
}

// route

proto.get = function(p) {
  var fn = arguments[arguments.length-1];
  var pathname = null;
  var stack = this.stack;
  stack.push({
    pathname: p,
    method: 'GET',
    fn: fn
  });
}

module.exports = proto;

