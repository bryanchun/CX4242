// https://bl.ocks.org/Bl3f/cdb5ad854b376765fa99
// http://bl.ocks.org/tjdecke/5558084
// http://next.plnkr.co/edit/2v8YQoZSClhKpW2U1pwi?p=preview&utm_source=legacy&utm_medium=worker&utm_campaign=next&preview

var margin = {top: 20, right: 90, bottom: 30, left: 120},
    w = 600 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;
var itemWidth = 70,
    cellSize = itemWidth - 1;
var offset = 100;
var numOfGraduations = 9;
var legendItemWidth = 40,
    legendItemHeight = 40;

d3.csv("./heatmap.csv").then(function(response) {

  // Data
  var heatmapTitle = "Visualizing Crimes in New York City",
      legendTitle = "No. of Crimes"
  var boroughKeys = ["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"];
  var data = response.reduce(function(r, d) {
    r.push(
      boroughKeys.map(function(borough) { return { borough: borough, crimeType: d["Crime Type"], count: +d[borough], year: +d.Year } })
    );
    return r;
  }, []).flat();
  var crimeKeys = d3.set(data.map(d => d.crimeType)).values().sort();
  var years = d3.set(data.map(d => d.year)).values();
  console.log(years);
  
  // Core elements
  var frame = d3.select("body")
      .append("div")
      .attr("width", w + margin.left + margin.right);
  var header = frame
      .append("g")
      .classed("header", true)
      // .style("width", w + margin.left + margin.right)
      ;
  header.append("text").text(heatmapTitle)
      .classed("title", true)
      .classed("blocky", true);

  var dropdown = header
        .classed("blocky", true)
        .append("g")
        .attr("id", "select")
        .append("text").text("Year:").classed("mono", true)
      .append("select");

  dropdown.selectAll("option")
        .data(years)
      .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

  var svg = frame.append("g")
    .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.bottom + margin.top)
      .attr("class", "blocky");
  
  var chart = svg.append("g")
      .attr("translate", `translate(${margin.left}, ${margin.top})`);

  // Axes
  var crimeLabels,
      boroughLabels;

  var xScale = d3.scaleBand().domain(crimeKeys).range([0, crimeKeys.length * itemWidth]),
      yScale = d3.scaleBand().domain(boroughKeys).range([0, boroughKeys.length * itemWidth]);
  var xAxis = d3.axisBottom(xScale),
      yAxis = d3.axisLeft(yScale).tickFormat(d => d);

  // x Axis and Label
  chart.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);
  chart.append("text")
    .text("Borough")
      .attr("class", "mono")
      .attr("transform", `translate(${margin.left/4}, ${h/2}) rotate(${-90})`);

  // y Axis and Label
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(${margin.left}, ${h - offset})`)
    .call(xAxis);
  chart.append("text")
    .text("Crime Type")
    .attr("class", "mono")
    .attr("transform", `translate(${w/2}, ${h - offset/2})`);


  function heatmap(data) {
    console.info(data);
    /**
     * takeaway: use scaleQuantile (for some reason TODO)
     */
    
    // Heat/Colour Scale uses Threshold to cut continuous -> Discretised values
    // zScale = d3.scaleThreshold().domain([0, d3.max(data.map(d => d.count))]).range(["#2980B9", "#E67E22", "#27AE60", "#27AE60"]);
    // zScale = d3.scaleOrdinal(d3.schemeReds[numOfGraduations]).domain([0, d3.max(data.map(d => d.count))]);
    // zScale = d3.scaleOrdinal().domain([0, d3.max(data.map(d => d.count))]).range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);
    var zScale = d3.scaleQuantile().domain([0, d3.max(data.map(d => d.count))]).range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);
    
    var cells = chart.selectAll(".cell")
        .data(data);
    cells.enter()
        .append("g").append("rect")
          .attr('class', 'cell bordered')
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("x", d => 2 + margin.left + xScale(d.crimeType))
          .attr("y", d => yScale(d.borough))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill", d => zScale(d.count));

    // cells.exit().remove();

    /**
     * takeaway: .quantiles()
     */
    var legendData = [0].concat(zScale.quantiles()),
        legend = chart.append("g").selectAll(".legend")
          .data(legendData);
    /**
     * takeaway: separate references to legend <g> and individual legend element <g>
     */
    var legendElement = legend.enter()
          .append("g")
          .attr("class", "legend")
          .classed("mono", true);

    legendElement.append("text")
        .text(legendTitle)
        .attr("x", margin.left)
        .attr("y", h - legendItemHeight / 4)
        .attr("class", legend)
        .classed("mono", true);

    legendElement.append("rect")
        .attr("width", legendItemWidth)
        .attr("height", legendItemHeight / 2)
        .attr("x", (d, i) => margin.left + i * legendItemWidth)
        .attr("y", h)
        .attr("fill", d => zScale(d));

    legendElement.append("text")
        .classed("mono", true)
        .text(d => String(Math.round(d)))
        .attr("x", (d, i) => margin.left + i * legendItemWidth)
        .attr("y", h + legendItemHeight);

    // legendElement.exit().remove();
  }
  
  heatmap(data.filter(d => d.year == dropdown.property("value")));
  // heatmap(data.filter(d => d.year == "2014"));

  /**
   * takeaway: to update d3 data-driven charts
   *            1. d3.selectAll(".customClass").remove()
   *            2. reuse the data -> enter -> append procedure on new piece of data
   *            3. !!! Reference to dropdown, NOT the appended options... that way the first option will always be returned
   */
  d3.select("#select").on("change", () => {
    console.log("onchange", dropdown.property("value"));
    d3.selectAll(".cell").remove();
    d3.selectAll(".legend").remove();
    heatmap(data.filter(d => d.year == dropdown.property("value")));
  });
});


/**
 * DONE Problem 1: d3.scheme is not gradient
 * DONE Problem 2: legend text not showing
 * DONE Problem 3: update cells data
 * Problem 4: Center title and select -> forceable by css class only
 */