module.exports = function(app) {

var c = './controls/';

var pools = require(c+'pools');
app.get('/pools', pools.index);
app.get('/pools/:id', pools.edit);
app.get('pools/create', pools.create);

}
