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
    user: process.env.GMAIL_MAIL,
    pass: process.env.GMAIL_PASS
  }
});

var mailOptions = {
  from:'New England Public Health Training Center <nephtc.noreply@gmail.com>',
  to: '',
  subject: 'Your Inspection Test Results',
  html: compiledTemplate.render({usrAns: ansKey.inspReportJsonList})
};  

router.get('/', function(req, res) {
  res.send({message: "There's nothing here"});
});

router.get('/preview', function(req, res) {
  res.render('../views/email', {answers: ansKey.inspReportJsonList, usrAns: "USER"});
});

router.post('/reports', function(req, res) {

  var stillData = req.body.json;
  console.log(stillData);

  var report = new Report();
  report.formData = sanitize(req.body.json);
  var tmp = JSON.parse(report.formData);
  var email = tmp.emailAddress;
  console.log(email);

  report.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      mailOptions.to = email;
      mailOptions.html = compiledTemplate.render({answers: ansKey.inspReportJsonList, usrAns: email});
      transporter.sendMail(mailOptions, function(err, res){
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }      
      });
      res.sendStatus(200);
    }
  });
 
});

module.exports = router;