var querystring = require('querystring'),
    url = require('url');

module.exports = request;

function request(req) {
  var urlObj = url.parse(req.url);
  this.query = querystring.parse(urlObj.query);
}


