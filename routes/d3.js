let data = []
const mydata = d3.selectAll("#data")
    .style("color", "blue");
//console.log('help', mydata[0], typeof mydata[0])
Object.keys(mydata[0]).forEach(function (key) {
  data.push(mydata[0][key].innerHTML)
})
data.splice(-1,1)
console.log(data)
//var data = [10, 5, 12, 15]
var width = 1000,
  scaleFactor = 30000,
  barHeight = 100

let height = barHeight * data.length

var graph = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

var bar = graph.selectAll("g")
  .data(data)
  .enter()
  .append("g")
  .attr("transform", function(d, i) {
     return "translate(0," + i * barHeight + ")"
  })

bar.append("rect").attr("width", function(d) {
  return d.split(': ')[1] * scaleFactor
})

.attr("height", barHeight - 1)

bar.append("text")
  .attr("x", function(d) { return (d.split(': ')[1] * scaleFactor) })
  .attr("y", barHeight / 2)
  .attr("dy", ".50em")
  .text(function(d) { return d })
