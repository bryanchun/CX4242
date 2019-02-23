// https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
// https://beta.observablehq.com/@mbostock/d3-choropleth
// http://bl.ocks.org/lwhitaker3/e8090246a20d9515789b

/**
 * DONE Problem 1: colorScale
 * DONE Problem 2: yScale
 * DONE Problem 3: tooltip joins
 * DONE Problem 4: State outlines
 * (How does it work?)
 */

const numGraduations = 9;
const color = d3.scaleQuantize()
    .domain([1, 10])
    .range(d3.schemeGreens[9]);

const format = d => d + "%"; //d3.format(".0%");
const povertyTitle = "Poverty rate (%)";

const chart = () => {
  const width = 960;
  const height = 800;
  const margin = {top: 50, left: 150};
  const path = d3.geoPath();

  const svg = d3.select("body").append("svg")
      .attr("width", "100%")
      .attr("height", height);

  const map = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  map.append("text")
      .text("Choropleth Map of County Data")
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-family", "Arial")
      .attr("font-weight", "bold");

  
  map.append("g")
      .attr("transform", `translate(${width}, 40)`)
      .call(legend);

  const poverty = d3.map(),
        details = d3.map();
  const countyTooltip = d => `State: ${poverty.get(d.id).state}<br />County: ${poverty.get(d.id).county}<br />Poverty Rate: ${format(poverty.get(d.id).poverty)}<br />Total Population: ${details.get(d.id).population}<br />Income Per Capita: ${details.get(d.id).income}`;
  var tip = d3.tip()
      .attr("class", "tooltip")
      .offset(function() {
        return [0, -10]
      })
      .html(d => countyTooltip(d))
      .attr("dy", "5em");

  /**
   * takeaway: In d3, call is just a convenience function to turn other functions inside out.
   * https://github.com/Caged/d3-tip/issues/187#issuecomment-331845488
   * https://stackoverflow.com/a/22875221
   */
  Promise.all([
    d3.json("us.json"),
    d3.csv("county_poverty.csv", d => poverty.set(d.CensusId, {
      poverty: +d.Poverty, state: d.State, county: d.County
    })),
    d3.csv("county_detail.csv", d => details.set(d.CensusId, {
      population: +d.TotalPop, income: +d.IncomePerCap
    }))
  ]).then(function([us]) {
    map.append("g")
      .selectAll("path.county")
      .data( topojson.feature(us, us.objects.counties).features )
      .enter().append("path")
        .attr("class", "county")
        .attr("fill", d => color(poverty.get(d.id).poverty))
        .attr("d", path)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
      // .append("title")
      //   .text(d => countyTooltip(d));
    map.call(tip);
    /**
     * takeaway: typo path not g
     */
    map.append("path")
      .datum( topojson.mesh(us, us.objects.states, (a, b) => a !== b) )
      .attr("class", "states")
      .attr("d", path);

    // let max = d3.max(poverty.values().map(d => d.poverty));
    // console.log(poverty.values().filter(p => p.poverty == max));
    return svg.node();
  });
  
};

const legend = g => {
  const y = d3.scaleLinear()
    .domain(d3.extent(color.domain()))
    .rangeRound([0, 260]);

  g.selectAll("rect")
    .data(color.range().map(d => color.invertExtent(d)))
    .enter()
    .append("rect")
      .attr("width", 8)
      .attr("y", d => y(d[0]))
      .attr("height", d => y(d[1]) - y(d[0]))
      .attr("fill", d => color(d[0]));

  g.append("text")
    .attr("class", "caption")
    .attr("y", y.range()[0])
    .attr("x", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text(povertyTitle);

  g.call(
    d3.axisRight(y)
      .tickSize(13)
      .tickFormat(format)
      .tickValues(
        color.range().slice(1).map(d => color.invertExtent(d)[0])
      )
    )
    .select(".domain")
      .remove();
}

chart();