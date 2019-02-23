// https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3

// Required: data

var yearUb = 2017, yearLb = 2013, yearBase = 2012,
    yearsUb = [...Array(yearUb + 1).keys()], yearsLb = [...Array(yearLb).keys()],
    years = yearsUb.filter(x => !yearsLb.includes(x));    // array difference
var data = data.map(function(d) {
  return {
    country: d.country,
    count: d[`population_${yearBase}`] + d3.sum(years, y => d.growth[`year_${y}`]),
    growth: [d[`population_${yearBase}`], ...years.map(y => d.growth[`year_${y}`])]
  };
}).sort((x, y) => d3.descending(x.count, y.count));

var margin = {top: 15, left: 100, right: 25, bottom: 15},
    bardims = {offset: 5, height: 40, width: 700},
    linechartdim = {width: 200, height: 200};
var width = 1200 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
var barchart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var xScale = d3.scaleLinear().domain([0, d3.max(data.map(d => d.count))]).range([0, bardims.width]),
    yScale = d3.scaleBand().domain(data.map(d => d.country)).range([0, height]);

var yAxis = d3.axisLeft(yScale).tickSize(0),
    gy = barchart.append("g")
          .attr("class", "y axis")
          .call(yAxis);

var bars = barchart.append("g")
    .attr("class", "bars")
    .selectAll(".bar")
    .data(data)
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
    .attr("x", bardims.offset * 3)
    .attr("y", d => yScale(d.country) + bardims.height / 2 + bardims.offset * 2);

/**
 * takeaway: ref = d3.selectAll, ref.nodes()[i]
 *           year :: years -> x-coordinate -- is scaleBand under ordinal scales
 *           yScale specify range... or how can it inflate the ticks?
 *           axis label added in g, do NOT add it inside axis
 * @param {*} d 
 * @param {*} i 
 */
function populationGrowthLineChart(d, i) {
  d3.select(barRects.nodes()[i]).attr("class", "bar highlighted");

  // console.log(d.growth);
  /**
   * takeaway: population is the cumulative denominator
   */
  var data = [];
  for (i = 0; i < d.growth.length - 1; i++) {
    let population = d3.sum(d.growth.slice(0, i+1));
    let pctGrowth = (d.growth[i+1]) / population * 100;
    data.push(pctGrowth);
  }
  // console.log(data);
  // console.log(yScale(d.country) + bardims.offset);

  var linechart = svg.append("g")
      .attr("class", "linechart")
      .attr("width", linechartdim.width)
      .attr("height", linechartdim.height)
      .attr("transform", `translate(${bardims.width + margin.left + margin.right*2}, ${margin.top})`);

  var x = d3.scaleBand().domain(years).range([0, linechartdim.width])
      y = d3.scaleLinear().domain(d3.extent(data)).range([linechartdim.height, 0]);

  var line = d3.line()
      .x((d, i) => x(years[i]))
      .y((d, i) => y(data[i]));

  // x axis
  var xAxis = linechart.append("g")
      .attr("transform", `translate(${0}, ${linechartdim.height + margin.top})`)
      .call(d3.axisBottom(x));
  linechart.append("text")
      .text("Year")
      .attr("x", linechartdim.width - margin.right)
      .attr("y", linechartdim.height + margin.top * 4);

  // y axis
  var yAxis = linechart.append("g")
      .attr("transform", `translate(${0}, ${margin.top})`)
      .call(
        d3.axisLeft(y)
          .tickFormat(d3.format(".2f")));
  linechart.append("text")
      .text("Pct %")
      .attr("text-anchor", "end")
      .attr("y", margin.top / 4);

  // line
  linechart.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("transform", `translate(${0}, ${margin.top})`);
}

function removeLineCharts(d, i) {
  d3.select(barRects.nodes()[i]).attr("class", "bar")
  d3.selectAll(".linechart").remove();
}
