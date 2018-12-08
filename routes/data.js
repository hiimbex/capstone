var express = require('express')
var router = express.Router()
const dotenv = require('dotenv')

/* GET home page. */
router.get('/', function(req, res, next) {
  var MongoClient = require('mongodb').MongoClient
  const uri = process.env.URI
  MongoClient.connect(uri, function(err, client) {
    const collection = client.db("housing").collection("ahs")
    collection.find({ AGE1: 21 }).project({_id: 0}).limit(1).toArray(function(err, result) {
      console.log(result)
      res.render('data', {body: result[0]});
      client.close()
    })
  });
});

module.exports = router;
