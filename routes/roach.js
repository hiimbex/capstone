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
  console.log('grad: ', grad, typeof grad)
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

    collection.find({ AGE1: 21, CITSHP1: "'1'" }).limit(1).toArray(function(err, result) {
      console.log(result.GRAD1, typeof result.GRAD1)
      resultz = result
    })
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
        console.log(typeof person.RODENT, person.RODENT, person.ROACH)
        let roachs = Object.keys(person)
        console.log(roachs)
        roachs.forEach(function (room) {
          let num = parseInt(person[room].charAt(1), 10)
          console.log(num)
          if (isNaN(num)) {
            total -= 1
          } else {
            if (num === 4 || num === 5) {
              num = 0
            }
            //console.log(counts[room], room)
            counts[room] += num
          }
        })
      })
      console.log('coutns', counts)
      Object.keys(counts).forEach(function (item) {
        // do the math
        percents[item] = counts[item]/total
      })
      console.log(percents)
      res.render('roach', { title: "American Housing Survey", total, body: percents });
      client.close()
    });
  });
});

module.exports = router;
