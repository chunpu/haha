var haha = require('../');
var request = require('supertest');

var app = haha();

var obj = {
  a: 1,
  b: [1,2]
};

app.get('/', function(req, res) {
  res.json(obj);
});

describe('res', function() {
  describe('.json(obj)', function() {
    it('should response with json', function(done) {
      request(app)
        .get('/')
        .expect('Content-Type', 'application/json')
        .expect(JSON.stringify(obj, null, '\t'))
        .expect(200, done);
    });
  });
});

