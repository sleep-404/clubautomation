var MongoClient = require('mongodb').MongoClient, assert = require('assert');
const express = require('express')
const app = express()
const MONGO_URL = 'mongodb://127.0.0.1:27017/robo';


app.get('/', function (req, res) {
  res.send('Hello World!')
  console.log("yoi!")
})


app.get('/update',function(req,res){
  console.log(req.query)

  var  name = req.query.name;
  var requiredStatus = req.query.requiredStatus; 
  MongoClient.connect(MONGO_URL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    if(err){
      res.send('Some error');
      db.close();
    }else{
      var switches = db.collection('switches');
      switches.find({name:name}).toArray(function(err, docs){
        if(err||docs.length==0){
          console.log(err,docs.length,'err||docs.length==0');
          res.send('inserted successfully');
          switches.insert({name:name,requiredStatus:requiredStatus});
          db.close();
        }else{
          switches.updateOne({name:name},{$set:{"requiredStatus":requiredStatus}});
          res.send(docs);
          db.close();
        }
      });
    }
   
  });

});

app.get('/get_all',function(req,res){
  MongoClient.connect(MONGO_URL, function(err, db){
    if(err){
      res.send({status:false,error:'Unable to connect to mongo, please start mongod service'});
    }else{
       var  switches = db.collection('switches');
       switches.find().toArray(function(err, docs){
         if(err){
           res.send({status:false});
         }else{
           res.send(docs);
         }
       });
    }
  });
}); 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

