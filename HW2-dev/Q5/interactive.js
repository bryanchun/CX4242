import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from "constants";

// https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3

// Required: data

var cumulativeData = data.map(function(d) {
  return {
    country: d.country,
    count: d.population_2012 + d.growth.year_2013 + d.growth.year_2014 + d.growth.year_2015 + d.growth.year_2016 + d.growth.year_2017
  };
}).reverse();//.sort((x, y) => d3.descending(x.count, y.count));

var margin = {top: 15, left: 100, right: 25, bottom: 15},
    bardims = {offset: 5, height: 40};
var width = 960 - margin.left - margin.right,
    chartWidth = 700,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var xScale = d3.scaleLinear().domain([0, d3.max(cumulativeData.map(d => d.count))]).range([0, chartWidth]),
    yScale = d3.scaleBand().domain(data.map(d => d.country)).range([0, height]);

var yAxis = d3.axisLeft(yScale).tickSize(0),
    gy = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

var bars = svg.append("g")
    .attr("class", "bars")
    .selectAll(".bar")
    .data(cumulativeData)
    .enter()
    .append("g");

// Add rect for each bar
var barRects = bars.append("rect")
    .attr("class", "bar")
    .attr("x", bardims.offset)
    .attr("y", d => yScale(d.country) + bardims.offset)
    .attr("height", bardims.height)
    .attr("width", d => xScale(d.count))
    // on hover
    .on("mouseover", populationGrowthLineChart)
    .on("mouseout", removeLineCharts);

bars.append("text")
    .text(d => d.count.toLocaleString())
    .attr("class", "bar-count")
    .attr("x", bardims.offset * 2)
    .attr("y", d => yScale(d.country) + bardims.height / 2 + bardims.offset * 2);

/**
 * takeaway: ref = d3.selectAll, ref.nodes()[i]
 * @param {*} d 
 * @param {*} i 
 */
function populationGrowthLineChart(d, i) {
  d3.select(barRects.nodes()[i]).attr("class", "bar highlighted");
  svg.append("")
}

function removeLineCharts(d, i) {
  d3.select(barRects.nodes()[i]).attr("class", "bar")
}