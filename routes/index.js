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

  //rose trying to filter grad
  let grad = req.query.grad
  console.log('grad: ', grad, typeof grad)
  if (grad === '1') { // masters, doctrates, etc
    query = { AGE1: { $gt: 0}, GRAD1: { $in: ["'45'", "'46'", "'47'"]}}
  } else if (grad === '2') { // showing bachelor's grads
    query = { AGE1: { $gt: 0}, GRAD1: { $in: ["'44'"]}}
  } else if ( grad === '3') {  // showing less than bachelor's
    query = { AGE1: {$gt: 0}, GRAD1: {$in: ["'39'", "'38'", "'37'", "'36'",
    "'35'", "'34'", "'33'","'32'", "'31'"]} }
  } else { //show all
    query = { AGE1: {$gt: 0}}
  }


  //end

  let resultz
  var MongoClient = require('mongodb').MongoClient
  const uri = process.env.URI
  MongoClient.connect(uri, function(err, client) {
    const collection = client.db("housing").collection("ahs")

    collection.find({ AGE1: 21, CITSHP1: "'1'" }).limit(1).toArray(function(err, result) {
      console.log(result.GRAD1, typeof result.GRAD1)
      resultz = result
    })
    // 2 for mold means no, 1 means yes
    const projection = { MOLDKITCH: 1,
      MOLDBATH: 1,
      MOLDBEDRM: 1,
      MOLDBASEM: 1,
      MOLDLROOM: 1,
      MOLDOTHER: 1,
      _id: 0
    }

    collection.find(query).project(projection).toArray(function(err, result) {
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
      res.render('index', { title: total, body: percents, data: resultz[0]});
      client.close()
    });
  });
});

module.exports = router;
