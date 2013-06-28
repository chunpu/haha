var temp = {};

(function(exports){

var env = false; // env true mains nodes false mains browser

if (typeof module !== 'undefined' && module.exports) {
  module.exports = exports;
  env = true;
  var fs = require('fs');
  var path = require('path');
}

exports.render = function(id,data){	

  // check browser or nodejs
  /*
	var source = id;
	if(id.indexOf('<') === -1 && typeof document === 'object'){
		source = document.getElementById(id).innerHTML;
	}
  */
  var source = id; // text string

  var opt = arguments[arguments.length-1];

  if (typeof opt !== 'object') {
    opt = {};
  }

  if ('filename' in opt && env) {
    source = fs.readFileSync(opt.filename)+'';
  }

  /*
     layout:

     include({
       filename: 'title-h1.html',
       layout: 'back.html'
     })
   */

  function fixpath(_path) {
    // generate relative to absolute path
    if (_path.split('.').length === 1) {
      _path += '.html';
    }
    _path = path.resolve(path.dirname(opt.filename), _path);
    return _path;
  }

  function include(fn, o) {

    // include son template
    //var filename = path.resolve(path.dirname(opt.filename), fn); // get relative path
    filename = fixpath(fn);
    var o = o || {};
    o.filename = filename;

    var result = exports.render(o);

    if ('layout' in o) {
      // get a layout
      // we need to render layout first, because layout may get include
      // then put our shit into layout
      if (typeof o.layout === 'string') {
        var filename = fixpath(o.layout);
        var layout = exports.render({filename: filename});
        result = layout.replace(/<<\s*body\s*>>/, result);
      }
    }
    return result;
    console.log(filename);
    console.log("----------");
  }


  // inline function like include layout
  opt.include = include;
	
	var funcCode = "";
	funcCode += genVal(opt);
	var _start = "<\%";
	var _end = "%>";
	var srcArr = source.split(_start);
	for(var i = 0; i < srcArr.length; i++){
		var tempCode = srcArr[i].split(_end);
		if(tempCode.length === 1){
			funcCode += genHTML(tempCode[0]);
		}
		else if(tempCode.length === 2){
			funcCode += genJS(tempCode[0]) + genHTML(tempCode[1]);			
		}
	}
	funcCode += "return output;"
	
	var genFunc = new Function('opt',funcCode);	
	//console.log(genFunc);
	var result = genFunc(opt);
	return result;	
}


function genVal(opt) {
	var funcCode = "";
	for(var key in opt){
		funcCode += 'var '+key+' = opt.'+key+';\n';
	}
	funcCode += "var output = '';\n";
	
	return funcCode;
}

function genJS(str) {
	var funcCode = "";	
	if(str.indexOf('=') === 0){
		funcCode += "output += "+str.substring(1,str.length)+";\n";
	}
	else{
		funcCode += str+'\n';
	}	
	
	return funcCode;
}

function genHTML(str) {

	str = str.replace(/('|"|\\)/g, '\\$1')       
			 .replace(/\r/g, '\\r')
			 .replace(/\n/g, '\\n');	
	var funcCode = 'output += "'+str+'";\n';		
	return funcCode;
}

})(temp); 

