//Dependencies
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var sanitize = require('mongo-sanitize');
var sendgrid = require('sendgrid');
var handlebars = require('express-handlebars');
var hogan = require('hogan.js');
var fs = require('fs');
var xoauth2 = require('xoauth2');
var helpers = require('handlebars-helpers')();




// Connect database
var mongoose = require('mongoose');
  mongoose.promise = require('bluebird');
  // assert.equal(query.exec().constructor, require('bluebird'));
  mongoose.connect('mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASS + '@ds149221.mlab.com:49221/reports');


// Required Models
var Report = require('../models/reports');
var List = require('../models/anslist');


// Variables
var ansKey = JSON.parse(fs.readFileSync("./answerKey.json"));


// Needed mail variables and classes
var nodemailer = require('nodemailer');
var template = fs.readFileSync("./views/hogan_email_template/email.hjs", "utf-8");
var compiledTemplate = hogan.compile(template);
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




// Routes, Post --> post user answers to database, Get:report_id --> see individual report
var router = express.Router();

/**** POST ****/
router.post('/reports', function(req, res) {

  // create db object
  var report = new Report();
  report.formData = sanitize(req.body.json);

  // parse needed info for email
  var mailData = JSON.parse(report.formData);
  var usrAns = mailData.inspReportJsonList;
  var email = mailData.emailAddress;
  

  // Compile Answers
  var list = new List();
  var answers = list.getAnswers(ansKey.inspReportJsonList, mailData.inspReportJsonList);

  // insert into db
  report.save(function(err) {
    if (err) {
      console.log(err);
      res.sendStatus(503);
    } else {

      // Insert callback configures email
      mailOptions.to = email;
      mailOptions.html = compiledTemplate.render({answers: answers, email: email});

      // send email
      transporter.sendMail(mailOptions, function(err, res){
        if (err) {
          res.sendStatus(501);
          console.log(err);
        } else {
          console.log(res);
        }      
      });

      // Send 
      res.sendStatus(200);
    }

  });
 
});


/**** GET:[PARAMS_ID] ****/
router.get('/reports/:report_id', function(req, res) {
    Report.findById(req.params.report_id, function(err, report) {
        if (err) {
          res.sendStatus(404);
          console.log(err);
        }
        report = JSON.parse(report.formData);
        var list = new List();
        var answers = list.getAnswers(ansKey.inspReportJsonList, report.inspReportJsonList);
        var email = report.emailAddress;

        res.render('../views/email', {answers: answers, email: email});
    });
});




































module.exports = router;