var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.promise = require('bluebird');

var ReportSchema = new Schema({
  formData: String
});

module.exports = mongoose.model('Report', ReportSchema);  