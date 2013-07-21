var haha = require('../');
var request = require('supertest');
var fs = require('fs');

var app = haha();

app.get(haha.static(__dirname + '/assets'));

app.get(function(req, res) {
  res.writeHead(404);
  res.end('404 not found');
});

describe('haha.static', function() {

  describe('GET /hello.html', function() {

    it('should return mime "text/html"', function(done) {
      var file = fs.readFileSync(__dirname + '/assets/hello.html') + '';
      request(app).get('/hello.html')
        .expect('Content-Type', 'text/html')
        .expect(file)
        .expect(200, done);
    });
  });

  describe('GET /nosuchfile', function() {
    it('should next and return 404', function(done) {
      request(app).get('/nosuchfile')
        .expect(404, done);
    })
  });

  describe('GET /dir', function() {
    it('should redirect to /dir/', function(done) {
      request(app).get('/dir')
        .expect('Location', '/dir/')
        .expect(302, done);
    });
  });

  describe('GET /', function() {
    it('should return the index file', function(done) {
      var file = fs.readFileSync(__dirname + '/assets/index.html') + '';
      request(app).get('/')
        .expect(file)
        .expect(200, done)
    })
  });
});
