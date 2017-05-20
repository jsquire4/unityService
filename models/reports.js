var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.promise = require('bluebird');

var ReportSchema = new Schema({
  postData: Schema.Types.Mixed
});

module.exports = mongoose.model('Report', ReportSchema);