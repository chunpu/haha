function Render(r) {
  if (r instanceof RegExp) {
    this.route = r;
  } else if (typeof r === 'string'){
    this.pathname = r;
    if (r.indexOf('*') === -1 && r.match(/:[^\/]+?/i) == null) {
      // just string
      this.route = r;
    } else {
      // complex string
      var str = r.replace(/\*/g, '(.*)');
      str = str.replace(/:[^\/]+/gi, "(?:([^\\/]+?))");
      str = '^' + str + '\\/?$';
      this.route = new RegExp(str, 'i');
    }
  } else {
    throw new TypeError("wrong route type");
  }
}

Render.prototype.getParams = function(pathname) {
  
  var params = [];
  if (typeof this.route === 'string') {
    return null;
  }
  var results = this.route.exec(pathname);

  
  var tmplPath = this.pathname.replace(/:([^\/]+)/g, "$1");
  
  var results2 = this.route.exec(tmplPath);

  for (var i = 1; i < results.length; i++) {
    if (results2[i] === '*') {
       params.push(results[i]);
    } else {
      params[results2[i]] = results[i];
    }
  }

  return params;
}

Render.prototype.test = function(pathname) {

  if (typeof this.route === 'string') {
    if (pathname === this.route) {
      return true;
    }
    return false;
  } else if (this.route instanceof RegExp) {
    return this.route.test(pathname);
  } else {
    throw new Error('inside error');
  }
   
}


module.exports = Render;
