
var data = [10, 5, 12, 15];
         
         var width = 300 
            scaleFactor = 20, 
            barHeight = 30;
         
         var graph = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", barHeight * data.length);
         
         var bar = graph.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
               return "translate(0," + i * barHeight + ")";
            });
         bar.append("rect").attr("width", function(d) {
            return d * scaleFactor;
         })
         
         .attr("height", barHeight - 1);
         
         bar.append("text")
            .attr("x", function(d) { return (d*scaleFactor); })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) { return d; });