var haha = require('../');
var request = require('supertest');
var fs = require('fs');

var app = haha();

app.get(haha.static(__dirname + '/assets'));

app.get(function(req, res) {
  res.writeHead(404);
  res.end('404 not found');
});

describe('haha.static()', function() {

  describe('GET /hello.html', function() {

    it('should return mime "text/html"', function(done) {
      var helloHtml = __dirname + '/assets/hello.html';
      var file = fs.readFileSync(helloHtml) + '';
      var mtime = fs.statSync(helloHtml).mtime;
      request(app).get('/hello.html')
        .expect('content-type', 'text/html')
        .expect('last-modified', mtime.toUTCString())
        .expect(file)
        .expect(200, done);
    });
  });

  describe('GET /hello.html with if-modified-since', function() {
    it('should return 304 not modified', function(done) {
      var helloHtml = __dirname + '/assets/hello.html';
      var mtime = fs.statSync(helloHtml).mtime;
      request(app).get('/hello.html')
        .set('if-modified-since', mtime.toUTCString())
        .expect(304, done);
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
        .expect('content-type', 'text/html')
        .expect(200, done)
    })
  });
});
