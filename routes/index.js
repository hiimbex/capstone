var express = require('express')
var router = express.Router()
const dotenv = require('dotenv')
var d3 = require('d3')

/* GET home page. */
router.get('/', function(req, res, next) {
  let resultz
  var MongoClient = require('mongodb').MongoClient
  const uri = process.env.URI
  console.log(process.env.URI)
  MongoClient.connect(uri, function(err, client) {
    const collection = client.db("housing").collection("ahs")
    collection.find({ AGE1: 21 }).limit(2).toArray(function(err, result) {
      if (err) throw err
      //console.log(result)
      resultz = result
      res.render('index', { title: resultz[0].age, body: resultz[0]});
     // d3.selectAll("p").style("color", "white");
      client.close()
    });
  });
  //res.render('index', { title: resultz });
});

module.exports = router;
