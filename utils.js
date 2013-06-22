var utils = {};

utils.merge = function(a, b) {
  if (a && b) {
    for (var i in b) {
      a[i] = b[i];
    }
  }
  return a;
}

module.exports = utils;
