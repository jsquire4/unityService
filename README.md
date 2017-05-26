# unityService
auto mailer and reporting show page using Node.js

This app requires Mongodb using Mlab, and Nodemailer using Gmail.  
To avoid leaking sensitive keys, passwords, and other information, add a .env file in the root directory.


//.env
GMAIL_MAIL = email@gmail.com
GMAIL_PASS = emailpass1234
MLAB_PASS = mlabpass1234
MLAB_USER = userName
etc.


There are currently only 3 routes that work:
// (index.js)

1. post (/reports)
  This route takes in a json string object, parses it into json, saves it to the database and then sends an email

2. get (/reports/:report_id)
  This route brings up a show page for the user that has successfully posted a report, and recieved an email.
  The report id is generated and then added to the variable link in each email from the post(/reports)
  
3. post (/secret_posting_url_for_previewing_email)
  This route is just to help with checking post data, and email development.  
  Using the Postman application by Google makes it easier to decipher
  
Current dependencies:
bluebird
body-parser
config.json
express
express-handlebars
express-session
formidable
fs
handlebars-helpers
hogan.js
mongo-sanitize
mongodb
mongoose
morgan
nodemailer
sendgrid
url
xoauth2
