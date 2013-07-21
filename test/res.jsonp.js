var haha = require('../');
var request = require('supertest');

var app = haha();

var testObj = {
  a: 1,
  b: [1,2]
};

var testStr = JSON.stringify(testObj);

app.get('/', function(req, res) {
  res.jsonp(testObj);
});


app.get('/user_defined', function(req, res) {
  
  // GET: /user_defined?bar=foo
  res.jsonp('bar', testObj);
});

describe('res', function() {
  describe('.jsonp(obj)', function() {

    // first, default to callback
    it('should response with jsonp', function(done) {
      var foo = 'foo';
      var req = request(app)
                  .get('/?callback=' + foo)
                  .expect('Content-Type', 'text/javascript');

      req.expect(foo + '(' + testStr + ')');
      req.expect(200, done);
    });

  });

    // second, user-defined
  describe('.jsonp(newCallbackName, obj)', function() {
    var foo = 'foo2';
    it('should response with jsonp and recognize the user-defined callback function name, such as /user_defined?bar=' + foo, function(done) {
      var req = request(app)
                  .get('/user_defined?bar=' + foo)
                  .expect('Content-Type', 'text/javascript');

      req.expect(foo + '(' + testStr + ')');
      req.expect(200, done);
    });
  });
});

