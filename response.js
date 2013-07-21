var setting = require('./setting.js');
var utils = require('./utils');
var fs = require('fs');

var res = {};

/**
 * Get value by HTTP header name
 *
 * Examples:
 *
 *     var contentType = res.get('content-type');
 *
 * just as same as inside response.getHeader()
 * so the header name is case insentive
 * can only be called before the http header is sent
 *
 * @param {String} name
 * @return {String}
 * @api public
 */

res.get = function(name) {
  return this.getHeader(name);
}

/**
 * Set HTTP Header
 *
 * Examples:
 *
 *     res.set('content-type', 'application/json');
 *     res.set('set-cookie', ["type=ninja", "language=javascript"]);
 *     res.set({header1: 'val1', header2: 'val2'});
 *
 * the api is chainable
 *
 * @params {String} name
 * @params {Array|String|Object} value
 * @return {HttpRespnse}
 * @api public
 */

res.set = function(name, value) {
  if (typeof value === 'string' || Array.isArray(value)) {
    return res.setHeader(name, value);
  } else if (typeof value === "object") {
    for (var key in value) {
      arguments.callee(key, value[key]);
    }
  }
}

/**
 * Send json response.
 * 
 * Examples:
 * 
 *     res.json({user: 'myname'});
 *     res.json([1,2,3]);
 * 
 * @param {Mixed} obj
 * @return {Http Response} res
 * @api public
 */

res.json = function(json) {
  this.writeHead(200, {'Content-Type': 'application/json'});
  this.end(JSON.stringify(json, null, '\t'));
}

res.jsonp = function(callbackName, obj) {

  // lie on req
  if (obj === undefined) {
    obj = callbackName;
    callbackName = 'callback';
  }
  var req = this._req;
  var functionName = req.query[callbackName];
  this.writeHead(200, {'Content-Type': 'text/javascript'});
  try {
    var output = functionName + '(' + JSON.stringify(obj) + ')';
  } catch (e) {
    var output = 'wrong obj type';
  }
  this.end(output);
}

/**
 * Send 30x redirect response.
 * 
 * Examples:
 * 
 *     res.redirect('/login');
 *
 * @param {String} [status]
 * @param {String} url
 * @return {HttpResponse} res
 * @api public
 */

res.redirect = function(status, url) {
  if (url === undefined) {
    url = status;
    status = '302';
  }
  this.writeHead(status, {'Location': url});
  this.end();
}

/**
 * Send a page rendered by HTML Template
 * 
 * Examples:
 *
 *     res.render('/index.html', {title: 'home'});
 *
 * @param {String} viewpath  
 * @param {Object} [options]
 * @return {HttpResponse} res
 * @api public
 */

res.render = function(filepath, _opt) {

  var views = './views';
  filepath = views + filepath + '.html';
  this.writeHead(200, {'Content-Type': 'text/html'});

  var output = (function render(filepath) {

    var opt = {};
    opt.$ = $;
    utils.merge(opt, _opt);
    opt.filename = filepath;
    
    console.log(opt);
    //console.log(filepath);
    var file = fs.readFileSync(filepath)+'';
    var layout = getLayout(views);
    file = layout.replace(/<<\s*body\s*>>/, file);
    //return(ejs.render(file, opt));

  })(filepath);
  // ?????
  output = output.replace(/&lt;/g, '<');
  output = output.replace(/&gt;/g, '>');
  output = output.replace(/&quot;/g, '"');
  this.end(output);
}

function getLayout(views) {
  var filepath = views + '/layout.html';
  var layout = fs.readFileSync(filepath)+'';
   
  //return ejs.render(layout, {filename: filepath});
}

module.exports = res;
