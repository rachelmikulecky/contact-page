var express = require('express');
var app = express();
var emailRegex = require('email-regex');
var bodyParser = require('body-parser');
var sendmail = require('sendmail')();


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.set('views', __dirname+'/views');

app.get('/', function(req,res,next){
  res.render('index', {success: ""});
});
app.post('/', function(req,res,next){
  var correct = 0;
  var success = {email:"", name:"", message:""};
  var email = req.body.email;
  if(emailRegex().test(email)){
    success.email = "true";
    ++correct;
  }
  else{
    success.email = "false";
  }
  var message = req.body.message;
  if(message){
    success.message = "true";
    ++correct;
  }
  else{
    success.message = "false"
  }
  var name = req.body.name;
  if(name){
    success.name = "true"
    ++correct;
  }
  else{
    success.name = "false";
  }
  if (correct === 3) {
    sendmail({
        from: email,
        to: 'zep100@gmail.com',
        subject: name,
        html: message,
      }, function(err, reply) {
        console.log("!!!!!!!!!!!!!!!");
        if(err){
          res.render('index', {success: "false"});
        }
        else{
          res.render('index', {success: "true"});
        }
    });
  }
  else {
    res.render('success', {success: success, content: req.body});
  }
});
app.listen(3000, function(){
  console.log('Application running on localhost on port 3000');
});
