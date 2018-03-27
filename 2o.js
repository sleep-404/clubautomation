var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/pro2";
var app =express();
var bodyParser = require('body-parser');

var encoder = bodyParser.urlencoded({ extended: false});
app.get('/',function(req , res){
res.send("Yo dude");
});

app.get('/app/new_user',function(req , res){
  MongoClient.connect(url , function(err, db){
  var users = db.collection("users")
    if(err){
      res.send('Some error, rare case try again later');
      db.close();
    }else{
      users.insert({name:req.query.username,username:req.query.username,password:req.query.password});
      res.send("Registerd succesfully");
      console.log("Registerd succesfully");
      db.close();
    }
  });
});

app.get('/app/login',function(req , res){
  console.log("A a request has been received from app");
  console.log(req.query.username);
  console.log(req.query.password);
  MongoClient.connect(url , function(err, db){
  var users = db.collection("users")
    if(err){
      res.send('Some error, rare case try again later');
      db.close();
    }else{
      users.find({username:req.query.username,password:req.query.password}).toArray(function(err, docs){
        console.log(docs);
        if(err||docs.length==0)
        {res.send("Who the F%$* are you");}
        else {
          res.send("Permission Granted");
        }
        db.close();
      });
    }
  });
});


app.listen(3000, function(){
  console.log("Let's try our luck");
});
