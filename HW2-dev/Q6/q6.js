// https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f

var svg = d3.select("body")
      .append("svg");
var width = 1000,
    height = 800;
svg.attr("width", width)
      .attr("height", height);
var margin = {top: 40};
var key = {width: 8};

var poverty = d3.map();
var path = d3.geoPath();

var yScale = d3.scaleLinear()
      .domain([1, 20])
      .rangeRound([600, 860]);
      // move to right side of the svg
var colorScale = d3.scaleThreshold()
      .domain(d3.range(2, 20))
      .range(d3.schemeBlues[9]);

var g = svg.append("g")
      .attr("class", "key")
      .attr("transform", `translate(${0}, ${margin.top})`);

g.selectAll("rect")
      .data(colorScale.range().map(function(d) {
          // Determines from the inverse map, the range needed to produce d
          d = colorScale.invertExtent(d);
          if (d[0] == null) d[0] = yScale.domain()[0];
          if (d[1] == null) d[1] = yScale.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("width", key.width)
        .attr("y", d => yScale(d[0]))
        .attr("width", d => yScale(d[1]) - yScale(d[0]))
        .attr("fill", d => colorScale(d[0]));

g.append("text")
      .attr("class", "legend")
      .attr("x", -6)
      .attr("y", yScale.range()[0])
      .attr("fill", "#000")
      .text("Poverty Rate");

var numTicks = 13;
g.call(
  d3.axisRight(yScale)
    .tickSize(numTicks)
    .tickFormat((y, i) => i > 0 && i < numTicks - 1 ? y + "%" :
                            i == 0 ? "≤" + y + "%" : "≥" + y + "%")
    .tickValues(colorScale.domain()))
  .select(".domain")
  .remove();

/**
 * takeaway: county and country, counties and countries make big differences
 */
var promises = [
  d3.json("us.json"),
  d3.csv("county_poverty.csv", d => poverty.set(d.CensusId, +d.Poverty))
];

Promise.all(promises).then(ready);

function ready([us]) {
  // Obtain the first resolution only, ignore poverty csv
  svg.append("g")
      // .attr("class", "counties")
    .selectAll("path")
    .data(
      topojson.feature(us, us.objects.counties).features
    )
    .enter().append("path")
      .attr("fill", d => colorScale(d.rate = poverty.get(d.CensusId)))
      .attr("d", path)
    .append("title")
      .text(d => d.rate + "%");
  
  svg.append("path")
      .datum(
        topojson.mesh(us, us.objects.states, (a, b) => a !== b)
      )
      .attr("class", "states")
      .attr("d", path);
}

/**
 * Problem 1: colorScale
 * Problem 2: yScale
 * Problem 3: tooltip joins
 * (How does it work?)
 */