var utils = require('./utils.js');
var proto = require('./proto.js');


module.exports = createServer;

function createServer() {
  function app(req, res, next) {
    app.handle(req, res, next);
  }
  app.stack = [];
  utils.merge(app, proto);
  return app;
}

module.exports.static = require('./middleware/static');
module.exports.view = require('./middleware/view');
