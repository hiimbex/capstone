var express = require('express')
var router = express.Router()
const dotenv = require('dotenv')

/* GET home page. */
router.get('/', function(req, res, next) {
  let query
  // Get query parameters
  let citizen = req.query.citizen
  console.log('citizen: ', citizen, typeof citizen)
  if (citizen === '0') { // only show non-citizens
    query = { AGE1: { $gt: 0 },  CITSHP1: { $in: [ "'5'" ] }}
  } else if (citizen === '1') { // only show citizens
    query = { AGE1: { $gt: 0 },  CITSHP1: { $in: [ "'1'", "'2'", "'3'", "'4'" ] }}
  } else { // show everyone
    query = { AGE1: { $gt: 0 }}
  }

  let resultz
  var MongoClient = require('mongodb').MongoClient
  const uri = process.env.URI
  MongoClient.connect(uri, function(err, client) {
    const collection = client.db("housing").collection("ahs")

    collection.find({ AGE1: 21, CITSHP1: "'1'" }).limit(1).toArray(function(err, result) {
      console.log(result)
      resultz = result
    })
    // 2 for mold means no, 1 means yes
    //const query = { AGE1: 24 }
    const projection = { MOLDKITCH: 1,
      MOLDBATH: 1,
      MOLDBEDRM: 1,
      MOLDBASEM: 1,
      MOLDLROOM: 1,
      MOLDOTHER: 1,
      _id: 0
    }
    console.log(query)
    collection.find(query).project(projection).toArray(function(err, result) {
      console.log(result)
      if (err) throw err
      let counts = { MOLDKITCH: 0,
        MOLDBATH: 0,
        MOLDBEDRM: 0,
        MOLDBASEM: 0,
        MOLDLROOM: 0,
        MOLDOTHER: 0
      }
      let percents = { MOLDKITCH: 0,
        MOLDBATH: 0,
        MOLDBEDRM: 0,
        MOLDBASEM: 0,
        MOLDLROOM: 0,
        MOLDOTHER: 0
      }
      let total = result.length
      result.forEach(function (person) {
        let molds = Object.keys(person)
        molds.forEach(function (room) {
          let num = parseInt(person[room].charAt(1), 10)
          if (isNaN(num)) {
            total -= 1
          } else {
            if (num === 2) {
              num = 0
            }
            counts[room] += num
          }
        })
      })
      Object.keys(counts).forEach(function (item) {
        // do the math
        percents[item] = counts[item]/total
      })
      //res.render('index', { title: result[0].AGE1, body: result[0]});
      res.render('index', { title: total, body: percents, data: resultz[0]});
      client.close()
    });
  });
});

module.exports = router;
