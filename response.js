var setting = require('./setting.js');
var ejs = require('ejs');
var utils = require('./utils');
var fs = require('fs');

var response = {};

response.json = function(json) {
  this.writeHead(200, {'Content-Type': 'application/json'});
  this.end(JSON.stringify(json, null, '\t'));
}

function $(file, opt) {
   var str = fs.readFileSync('./views/'+file+'.html')+'';
   opt.$ = $;
   str = ejs.render(str, opt);
   return str;
}

response.render = function(filepath, _opt) {

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
    return(ejs.render(file, opt));

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
   
  return ejs.render(layout, {filename: filepath});
}

module.exports = response;
