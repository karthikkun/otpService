const express = require('express')
const crypto = require('crypto')
const moment = require('moment');
const bodyParser = require('body-parser');
const otpController = require('./controllers/otpcontroller.js');
const Config = require('./config');
const app = express()
const port = (process.env.PORT || Config.serverPort);

app.use(express.urlencoded());
app.use(express.json());

app.post('/api/validateotp', otpController.validateOTP);

app.post('/api/sendotp', otpController.sendOTP);

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

app.use('/',(req,res,next) => {
  console.log('Got A Hit to: '+req.path+" : "+ Date.now());    
  next();
});


//starting the express server
var listner = app.listen(port, ()=>{
  console.log('Server listens on port',port);
});

module.exports = app;
