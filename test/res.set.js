var haha = require('../');
var app = haha();

var request = require('supertest');

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.end('<html><body>xxx</body></html>');
});

describe('res', function() {
  describe('.set("Content-Type", "text/html")', function() {
    it('should set "Content-Type" header to "text/html"', function(done) {
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html')
        .expect(200, done);
    });
  });
});
