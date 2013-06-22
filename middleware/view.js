module.exports = function(filepath) {
  return function(req, res, next) {
    try {   
      res.render(filepath + req.pathname);
    } catch (e) {
      next(e);
    }
  }
}
