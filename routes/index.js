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
var url = require('url');


// Connect database
var mongoose = require('mongoose');
  mongoose.promise = require('bluebird');
  // assert.equal(query.exec().constructor, require('bluebird'));
  mongoose.connect('mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASS + '@ds149221.mlab.com:49221/reports');

// Required Models
var Report = require('../models/reports');
var List = require('../models/anslist');

// Server Variables
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

  // get email
  var mailData = JSON.parse(report.formData);
  var email = mailData.emailAddress;
  // var name = mailData.name; // *** Use name when available ***
  
  // insert into db 
  report.save(function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(503);
    } else {

      var host = req.headers.host;
      var usrUrl = "https://" + host + "/reports/" + data._id;

      // On callback configure email
      mailOptions.to = email;
      mailOptions.html = compiledTemplate.render({email: email, usrUrl: usrUrl}); // mail template located in views/hogan_email_template/email.hjs
      //mailOptions.html = compiledTemplate.render({email: email, usrUrl: usrUrl, name: name}); // *** Use name when available ***

      // Send
      transporter.sendMail(mailOptions, function(err, res){
        if (err) {
          res.sendStatus(501);
          console.log(err);
        } else {
          console.log(res);
        }      
      });

      res.sendStatus(200);
    }

  });
 
});

router.post('/secret_posting_url_for_previewing_email', function(req, res) {
  var report = new Report();
  report.formData = sanitize(req.body.json);
  report.save(function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(503);
    } else {
      var host = req.headers.host;
      var email = "user@usermail.com";
      var usrUrl = "https://" + host + "/reports/" + data._id;    
      res.render('../views/previews', {email: email, name: name, usrUrl: usrUrl});
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
        // var name = report.name; // *** Use name when avaialble ***

        // Render report show page 
        res.render('../views/show', {title: "Final Report", answers: answers, email: email});
        // res.render('../views/show', {answers: answers, email: email, name: name}); // *** Use name when available ***
    });
});

































module.exports = router;