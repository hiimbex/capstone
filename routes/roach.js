var express = require('express')
var router = express.Router()
const dotenv = require('dotenv')

/* GET home page. */
router.get('/', function(req, res, next) {
  let query = { AGE1: { $gt: 0 }}

  // Get query parameters
  let rent = req.query.rent
  if (rent === '1') { // only show non-citizens
    query = { AGE1: { $gt: 0 }, RENT: { $lt: 500 }}
  } else if (rent === '2') { // only show citizens
    query = { AGE1: { $gt: 0 }, RENT: { $gt: 500, $lt: 1000 }}
  } else if (rent === '3') { // only show citizens
    query = { AGE1: { $gt: 0 }, RENT: { $gt: 1000, $lt: 2000 }}
  } else if (rent === '4') { // only show citizens
    query = { AGE1: { $gt: 0 }, RENT: { $gt: 2000 }}
  }

  let citizen = req.query.citizen
  if (citizen === '0') { // only show non-citizens
    query = { AGE1: { $gt: 0 },  CITSHP1: { $in: [ "'5'" ] }}
  } else if (citizen === '1') { // only show citizens
    query = { AGE1: { $gt: 0 },  CITSHP1: { $in: [ "'1'", "'2'", "'3'", "'4'" ] }}
  }

  let grad = req.query.grad
  if (grad === '1') { // masters, doctrates, etc
    query = { AGE1: { $gt: 0}, GRAD1: { $in: ["'45'", "'46'", "'47'"]}}
  } else if (grad === '2') { // showing bachelor's grads
    query = { AGE1: { $gt: 0}, GRAD1: { $in: ["'44'"]}}
  } else if ( grad === '3') {  // showing less than bachelor's
    query = { AGE1: {$gt: 0}, GRAD1: {$in: ["'39'", "'38'", "'37'", "'36'",
    "'35'", "'34'", "'33'","'32'", "'31'"]} }
  }
  //end

  let resultz
  var MongoClient = require('mongodb').MongoClient
  const uri = process.env.URI
  MongoClient.connect(uri, function(err, client) {
    const collection = client.db("housing").collection("ahs")
    // 2 for roach means no, 1 means yes
    const projection = { ROACH: 1,
      RODENT: 1,
      _id: 0
    }

    collection.find(query).project(projection).toArray(function(err, result) {
      if (err) throw err
      let counts = { ROACH: 0,
        RODENT: 0
      }
      let percents = { ROACH: 0,
        RODENT: 0
      }
      let total = result.length
      result.forEach(function (person) {
        let roachs = Object.keys(person)
        roachs.forEach(function (room) {
          let num = parseInt(person[room].charAt(1), 10)
          if (isNaN(num)) {
            total -= 1
          } else {
            if (num === 4 || num === 5) {
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
      res.render('roach', { title: "American Housing Survey", total, body: percents });
      client.close()
    });
  });
});

module.exports = router;
