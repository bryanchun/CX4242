/**
 * Data loading
 * And Driver code
 * takeaway: js function returning arrays is hard to understand
 */

var dataset1 = [],
    dataset2 = [],
    dataset3 = [],
    dataset4 = [],
    dataset5 = [];

d3.csv("movies.csv", movie => {
  /**
   * Figure title: Wins+Nominations vs. Rating
   * X axis (horizontal) label: Rating
   * Y axis (vertical) label: Wins+Noms
   */
  // console.log(movie.Rating);
  dataset1.push([
    parseFloat(movie.Rating),
    parseInt(movie.WinsNoms),
    parseInt(movie.IsGoodRating),
    50
  ]);
  key1 = ['Rating', 'Wins+Norms'];
  title1 = "Wins+Nominations vs. Rating";

  /**
   * Figure title: Budget vs. Rating
   * X axis (horizontal) label: Rating
   * Y axis (vertical) label: Budget
   */
  dataset2.push([
    parseFloat(movie.Rating),
    parseInt(movie.Budget),
    parseInt(movie.IsGoodRating),
    50
  ]);
  key2 = ['Rating', 'Budget'];
  title2 = "Budget vs. Rating";

  dataset3.push([
    parseFloat(movie.Rating),
    parseInt(movie.Votes),
    parseInt(movie.IsGoodRating),
    parseInt(movie.WinsNoms)
  ]);
  key3 = ['Rating', 'Votes'];
  title3 = "Votes vs. Rating sized by Wins+Nominations";

  title4 = "Wins+Nominations (square-root-scaled) vs. Rating";
  title5 = "Wins+Nominations (log-scaled) vs. Rating";

}).then(function(data) {
  generateScatterPlot(dataset1, key1, title1);
  generateScatterPlot(dataset2, key2, title2);
  /**
   * Part b
   * Scaling symbol sizes
   */
  generateScatterPlot(dataset3, key3, title3, {rScale: d3.scaleLinear().range([3, 10])});
  /**
   * Part c
   * Axis scales in D3
   */
  generateScatterPlot(dataset1, key1, title4, {yScale: d3.scaleSqrt()});
  generateScatterPlot(dataset1, key1, title5, {yScale: d3.scaleLog().clamp(true).nice()});
});


/**
 * Part a
 * Creating scatter plots
 * takeaway: debugging strategies
 *           promises took me 2 hours to debug: empty array to populate
 *           js named optional arguments are positional...
 */
var w = 1000, h = 700 , padding = 100, offset = 60;

// const generateScatterPlot = (dataset, keys, title) => {
function generateScatterPlot(dataset, keys, title, optionalScales={}) {
  
  let { rScale = d3.scaleLinear(), yScale = d3.scaleLinear() } = optionalScales;
  var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

  let xScale = d3.scaleLinear()
            .domain([Math.floor(d3.min(dataset, d => d[0])), d3.max(dataset, d => d[0])])
            .range([padding, w - padding * 2]);
  yScale
            // domain [1e-6, ...] for log's sake
            .domain([1e-6, d3.max(dataset, d => d[1])])
            .range([h - padding, padding]); // reverse downwards y-axis to upwards y-axis
  console.log(yScale);
  
  var xAxis = d3.axisBottom(xScale);
  // x axis label
  var xLabel = svg.append("text")             
            .attr("transform", `translate(${w / 2}, ${h - offset})`)
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "sans-serif")
            .text(keys[0]);
  
  var yAxis = d3.axisLeft(yScale);
  // y axis label
  var yLabel = svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 40 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "sans-serif")
            .text(keys[1]);

  /**
   * takeaway: Use symbols for circles too
   */
  var badRatingPoints = svg.selectAll(".point")
            .data(dataset.filter(d => d[2] == 0))
            .enter()
            // .append("circle")
            // .attr("cx", d => xScale(d[0])) // cx not x, for x of center
            // .attr("cy", d => yScale(d[1])) // cy not y, for y of center
            // .attr("r", d => rScale(d[3]))
            // .attr("fill", "transparent")
            // .attr("stroke-width", 1)
            // .attr("class", "bad-rating");
            .append("path")
            .attr("d", d3.symbol()
                .type(d3.symbolCircle)
                .size(d => rScale(d[3])))
            .attr("transform", d => `translate(${xScale(d[0])}, ${yScale(d[1])})`)
            .attr("fill", "transparent")
            .attr("stroke-width", 1)
            .attr("class", "bad-rating");

  var goodRatingPoints = svg.selectAll(".point")
            .data(dataset.filter(d => d[2] == 1))
            .enter()
            .append("path")
            .attr("d", d3.symbol()
                .type(d3.symbolCross)
                .size(d => rScale(d[3])))
            .attr("transform", d => `translate(${xScale(d[0])}, ${yScale(d[1])})`)
            .attr("fill", "transparent")
            .attr("stroke-width", 1)
            .attr("class", "good-rating");

  // make x axis
  svg.append("g")
            .attr("class", "axis")  // Assign the ".axis" css class
            .attr("transform", `translate(0, ${h - padding})`)  // Transform axis to bottom
            .call(xAxis);           // takes `this` selection and hands it off to the function it takes (xAxis)
  // make y axis
  svg.append("g")
            .attr("class", "axis")  // Assign the ".axis" css class
            .attr("transform", `translate(${padding}, 0)`)  // Transform axis to bottom
            .call(yAxis);           // takes `this` selection and hands it off to the function it takes (yAxis)

  // make title
  svg.append("text")
            .attr("x", w / 2)
            .attr("y", padding / 2)   // appear above scatter plot
            .attr("text-anchor", "middle")
            .attr("class", "title")
            .text(title);
  
  var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${w - padding}, ${padding})`);

  legend.append("text")
            .text("Bad Rating")
            .attr("x", offset / 4)
            .attr("y", 5);
  legend.append("path")
            .attr("d", d3.symbol()
              .type(d3.symbolCircle).size(80))
            .attr("transform", d => `translate(${0}, ${0})`)
            .attr("fill", "transparent")
            .attr("stroke-width", 1)
            .attr("class", "bad-rating");

  legend.append("text")
            .text("Good Rating")
            .attr("x", offset / 4)
            .attr("y", offset / 2);
  legend.append("path")
            .attr("d", d3.symbol()
              .type(d3.symbolCross).size(80))
            .attr("transform", d => `translate(${0}, ${25})`)
            .attr("fill", "transparent")
            .attr("stroke-width", 1)
            .attr("class", "good-rating");


  //   function make_x_gridlines() {		
  //     return d3.axisBottom(x)
  //         .ticks(5)
  // }
  
  // // gridlines in y axis function
  // function make_y_gridlines() {		
  //     return d3.axisLeft(y)
  //         .ticks(5)
  // }

//   // add the X gridlines
//   var xGrid = svg.append("g")			
//     .attr("class", "grid")
//     .attr("transform", `translate(0, ${h})`)
//     .call(make_x_gridlines()
//         .tickSize(-h)
//         .tickFormat("")
//     )

// // add the Y gridlines
// var yGrid = svg.append("g")			
//   .attr("class", "grid")
//   .call(make_y_gridlines()
//       .tickSize(-w)
//       .tickFormat("")
//   )

};


/**
 * Problem 1: log and sqrt scale not working as expected
 * Problem 2: circle symbol
 */