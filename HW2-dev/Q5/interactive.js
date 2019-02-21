// Required: data

var cumulativeData = data.map(function(d) {
  return {
    country: d.country,
    count: d.population_2012 + d.growth.year_2013 + d.growth.year_2014 + d.growth.year_2015 + d.growth.year_2016 + d.growth.year_2017
  };
});

var margin = {top: 15, left: 100, right: 25, bottom: 15};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var xScale = d3.scaleLinear().domain([0, d3.max(cumulativeData.map(d => d.count))]).range([0, width]),
    yScale = d3.scaleBand().domain(data.map(d => d.country)).range([height, 0]);

var yAxis = d3.axisLeft(yScale).tickSize(0),
    gy = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

var bars = svg.selectAll(".bar")
    .data(cumulativeData)
    .enter()
    .append("g");

// Add rect for each bar
bars.append("rect")
    .attr("class", "bar")
    .attr("y", d => d.country)
    .attr("height", yScale.rangeBand())
    .attr("width", d => xScale(d.count))