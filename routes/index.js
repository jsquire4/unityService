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
  mongoose.connect('mongodb://localhost:27017/unityService');

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
    clientId: '552629857675-6f4b8ev8h821n0svptphiv6cgkajk5cf.apps.googleusercontent.com',
    clientSecret: 'cduIgQArAd_kCT04jP-JiS8l',
    refreshToken: '1/MrdgjDWxnlXNZ-Ckgwv5eLi23FuKQswUXETooASjlgY',
    accessToken: 'ya29.GltPBPzFoEeczyHcY_vU6zp1bjKtbxZ84AsWwABE1D8Np05U-vi5HMOj8_KcW_3nTeZX4o8KdqJdhkWebA5cHggydyDI4FF89onLhoDG-06A5agrrbC_KK2sb6o7'
  }
});

var mailOptions = {
  from:'New England Public Health Training Center',
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
  var report = new Report();
  report.inspectionList = sanitize(req.body.inspReportJsonList);
  report.email = sanitize(req.body.emailAddress);
  report.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      mailOptions.to = report.email;
      mailOptions.html = compiledTemplate.render({name: "Jake"});
      // mailOptions.html = compiledTemplate.render({answers: ansKey.inspReportJsonList, usrAns: report.inspectionList});
      transporter.sendMail(mailOptions, function(err, res){
        if (err) {
          console.log(err);
        } else {
          console.log("Email Sent to " + mailOptions.to);
        }      
      });
      res.json({message: "report recived"});
    }
  });
});

module.exports = router;