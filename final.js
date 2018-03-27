var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/pro2";
var app =express();

var str1,str2;
MongoClient.connect(url ,function(err , db){
  var switches = db.collection('switches');
  switches.find().toArray(function(err, docs){
  var i = 0;
  str1 = docs[0].name + docs[0].status;
  str2 = docs[0].name + docs[0].status;
  for( i=1 ; i<docs.length ; i++  ){
     str1 = str1 +  docs[i].name + docs[i].status;
     str2 = str2 +  docs[i].name + docs[i].status;
   }
  });
})

app.get('/' , function(req , res){
  res.sendFile(__dirname + '/text.txt');
});

app.get('/app/update',function(req , res){
 console.log(req.query.name);
 var name = req.query.name;
 var req_state = parseInt(req.query.state);
 MongoClient.connect(url , function(err, db) {
    var switches = db.collection('switches');
    console.log("Connected successfully to server");
   if(err){
     res.send('Some error, rare case try again later');
     db.close();
   }else{
     switches.find({name:name}).toArray(function(err, docs){
       if(err||docs.length==0){
         console.log(err,docs.length,'err||docs.length==0');
         res.send('inserted successfully');
         switches.insert({name:name,status:req_state});
         db.close();
       }else{
         switches.updateOne({"name":name},{$set:{"status":req_state}});
         switches.find({name:name}).toArray(function(err, docs){
            res.send(docs);
         });
         db.close();
       }
     });
      console.log("after :");
     MongoClient.connect(url , function(err, db) {
        var switches = db.collection('switches');
        switches.find().toArray(function(err, docs){
          console.log(docs);
          var i = 0;
          str1 = docs[0].name + docs[0].status;
          for( i=1 ; i<docs.length ; i++  ){
            str1 = str1 +  docs[i].name + docs[i].status;
            }
         });
       });
      }
   });

   console.log('this is str1 after app' + str1);
   console.log('this is str2 after app' + str2);
 });

 app.get('/app/que',function(req,res){
   MongoClient.connect(url, function(err, db){
     if(err){
       res.send({status:false,error:'Unable to connect to mongo, please start mongod service'});
     }else{
        var  switches = db.collection('switches');
        switches.find({name : req.query.name}).toArray(function(err, docs){
          if(err||docs.length==0){
            res.send({status:false});
          }else{
            res.send("The state of " + docs[0].name + " is " + docs[0].status );
          }
        });
     }
   });
 });


app.get('/app/get_all',function(req,res){
  MongoClient.connect(url, function(err, db){
    if(err){
      res.send({status:false,error:'Unable to connect to mongo, please start mongod service'});
    }else{
       var  switches = db.collection('switches');
       switches.find().toArray(function(err, docs){
         if(err){
           res.send({status:false});
         }else{
           str1 = docs ;
           res.send(docs);
         }
       });
    }
  });
});
app.get('/rpi/que',function(req,res){
      MongoClient.connect(url, function(err, db){
       if(err){
         res.send({status:false,error:'Unable to connect to mongo, please start mongod service'});
      }else{
        var  switches = db.collection('switches');
        switches.find({name:req.query.name}).toArray(function(err, docs){
            if(err){
             res.send({status:false});
            }else{
         res.send(docs);
         }
       });
     }
      switches.find().toArray(function(err, docs){
        var i = 0;
        str2 = docs[0].name + docs[0].status;
        for( i=1 ; i<docs.length ; i++  ){
          str2 = str2 +  docs[i].name + docs[i].status;
         }
       });
    });
});
app.get('/rpi/get_all',function(req , res){
  var timer =   setInterval(function(){
      if(str1!=str2){
      MongoClient.connect(url , function(err ,db){
        var  switches = db.collection('switches');
        switches.find().toArray(function(err, docs){
          res.send(docs);
          console.log("data has been succesfully sent to R-pii ");
          var i = 0;
          str2 = docs[0].name + docs[0].status;
          for( i=1 ; i<docs.length ; i++  ){
             str2 = str2 +  docs[i].name + docs[i].status;
          }
        });
      });
      console.log('this is str1 after pi' + str1);
      console.log('this is str2 after pi' + str2);
      clearInterval(timer);
    }
    },1000);
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
        {res.send("Access denied");}
        else {
          res.send("Permission Granted");
        }
        db.close();
      });
    }
  });
});


app.listen(3000, function(req , res){
 console.log("listening on port no 3000");
});
