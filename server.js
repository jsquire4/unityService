var express = require('express');
var bodyParser = require('body-parser');
var sanitize = require('mongo-sanitize');
var nodemailer = require('nodemailer');
var fs = require('fs');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var app = express();
var routes = require('./routes/index');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.disabled('x-powered-by');
app.set('port', process.env.PORT || 3000);



app.use('/', routes);

app.use(function(req, res, next) {
  res.sendStatus(404);
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.sendStatus(503);
});

app.listen(app.get('port'), function(){
  console.log("Express started on http://localhost:" + app.get('port') + ' press Ctrl-C to terminate');
});

module.exports = app;


