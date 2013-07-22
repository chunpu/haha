var path = require('path');
var fs = require('fs');

module.exports = function(root, options) {
  return function(req, res, next) {
    var filepath = root + req.pathname;
    send(filepath);
    function send(filepath) {

    fs.readFile(filepath, function(err, data) {
      if (err) {
        if (err.code === 'EISDIR') {
          if (req.pathname.lastIndexOf('/') === req.pathname.length - 1) {
            // find the index file
            send(filepath + 'index.html');
            return;
          }
          res.redirect(req.pathname + '/');
          return;
        }
        next(err);
      } else {
        var extname = path.extname(req.pathname);
        var mimeType = (function getMime(extname) {
          return mime[extname] || 'text/plain';
        })(extname);
        res.writeHead(200, {'Content-Type': mimeType});
        res.end(data);
      }
    });
    }

  }
}



var mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.ttf': 'application/x-font-ttf',
  '.json': 'application/json',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg'
}
