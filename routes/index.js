var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var sanitize = require('mongo-sanitize');
var sendgrid = require('sendgrid');
var handlebars = require('express-handlebars');
var hogan = require('hogan.js');
var fs = require('fs');
var xoauth2 = require('xoauth2');

var mongoose = require('mongoose');
  mongoose.promise = require('bluebird');
  mongoose.connect('mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASS + '@ds149221.mlab.com:49221/reports');

var ansKey = JSON.parse(fs.readFileSync("./answerKey.json"));

var router = express.Router();
var Student = require('../models/students');
var Report = require('../models/reports');

var template = fs.readFileSync("./views/hogan_email_template/email.hjs", "utf-8");
var compiledTemplate = hogan.compile(template);

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'Oauth2',
    user: 'nephtc.noreply@gmail.com',
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_SECRET,
    refreshToken: process.env.GMAIL_RFRSH_TOKEN,
    accessToken: process.env.GMAIL_ACCESS_TOKEN
  }
});

var mailOptions = {
  from:'New England Public Health Training Center <nephtc.noreply@gmail.com>',
  to: '',
  subject: 'Your Inspection Test Results',
  html: compiledTemplate.render({answers: ansKey.inspReportJsonList, usrAns: ansKey.inspReportJsonList})
};  

router.get('/', function(req, res) {
  res.render('../views/email', {answers: ansKey.inspReportJsonList, usrAns: "user answers here"});
});

router.get('/preview', function(req, res) {
  res.render('../views/email', {answers: ansKey.inspReportJsonList, usrAns: "user answers here"});
});

router.post('/reports', function(req, res) {

  var stillData = req.body.json;
  console.log(stillData);

  var report = new Report();
  report.formData = req.body.json;
  console.log(report.postData);

  // report.inspectionList = sanitize(req.body.inspReportJsonList);
  // report.email = sanitize(req.body.emailAddress);

  report.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      // mailOptions.to = report.email;
      // mailOptions.html = compiledTemplate.render({answers: ansKey.inspReportJsonList, usrAns: report.inspectionList});
      // transporter.sendMail(mailOptions, function(err, res){
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(res);
      //   }      
      // });
      res.sendStatus(200);
    }
  });
 
});

module.exports = router;