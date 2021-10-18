//jshint esversion:6

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dbUser:1234@cluster0.a4rlg.mongodb.net/test');

app.use(bodyParser.urlencoded({extended: true}));

const User = mongoose.model('User', { username:String ,  email:String , password:String });

app.get("/", function(request, response){
  console.log("Hello");
  response.sendFile(__dirname + "/index.html");
});

app.post("/", function(request, response){
  User.find({ username : request.body.username , password : request.body.password }, function(err, docs){
    if(err){
      response.send("Error");
    }
    if(docs.length > 0){
      response.send("Logged in");
    }
    else{
      response.send("Check username and password");
    }
  });
});

app.post("/forgot", function(request, response){
  User.find({ username : request.body.username , email : request.body.email }, function(err, docs){
    if(err){
      response.send("Error");
    }
    if(docs.length > 0){
      User.update({ username : request.body.username , email : request.body.email }, {$set : { password : request.body.npassword}}, function(err){
        response.send("Changed Password");
      });
    }
    else{
      response.send("Check username and email");
    }
  });
});

app.post("/add", function(request, response){
  const newUser = new User({ username:request.body.username , email:request.body.email , password:request.body.password});
  newUser.save().then(() => console.log("Added"));

  response.send("Successfully Added")
});

app.listen(3000, function(){
  console.log("Server started on port 3000")
});
