var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.promise = require('bluebird');

var StudentSchema = new Schema({
  name: String,
  email: String
});

module.exports = mongoose.model('Student', StudentSchema);



















