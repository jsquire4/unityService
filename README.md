# unityService
auto mailer and reporting show page using Node.js and Mongodb

In order to run this project you must have node installed.  It is currently set up to run with a remote database hosted by Mlab, but that can easily be changed to a local Mongo database

To install node go here: https://nodejs.org/en/download/

To install Mongo go here: https://www.mongodb.com/download-center
  
To avoid leaking sensitive keys, passwords, and other information, add a .env file in the root directory and enter the following four lines with correct values.

/.env
MAIL_USER = email@nephtc.org
MAIL_PASS = emailpass1234
MLAB_PASS = mlabpass1234
MLAB_USER = userName


After adding the .env file, iniate the server (while in the project root directory) by running: 
- npm install
- node server.js

There are currently only 2 routes that work:

1. post (/reports)
  This route takes in a json string object, parses it into json, saves it to the database and then sends an email

2. get (/reports/:report_id)
  This route brings up a show page for the user that has successfully posted a report, and recieved an email. The report id is generated and then added to the variable link in each email from the post(/reports)

