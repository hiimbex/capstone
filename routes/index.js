var express = require('express')
var router = express.Router()
const dotenv = require('dotenv')

/* GET home page. */
router.get('/', function(req, res, next) {
  let resultz
  var MongoClient = require('mongodb').MongoClient
  const uri = process.env.URI
  console.log(process.env.URI)
  MongoClient.connect(uri, function(err, client) {
    const collection = client.db("housing").collection("ahs")
    // 2 for mold means no, 1 means yes
    //const query = { AGE1: 24 }
    const query = { AGE1: { $gt: 0 } }
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
        console.log(person)
        molds.forEach(function (room) {
          //console.log(room, person[room])
          let num = parseInt(person[room].charAt(1), 10)
          //console.log(num)
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
      console.log(counts)
      Object.keys(counts).forEach(function (item) {
        // do the math
        console.log(counts[item], total, counts[item]/total, percents[item])
        percents[item] = counts[item]/total
      })
      //res.render('index', { title: result[0].AGE1, body: result[0]});
      res.render('index', { title: total, body: percents});
      client.close()
    });
  });
});

module.exports = router;
