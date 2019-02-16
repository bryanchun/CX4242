// get the data
links =  [
  {
    "source": "Green Bay Packers",
    "target": "Kansas City Chiefs",
    "value": 0
  },
  {
    "source": "Green Bay Packers",
    "target": "Oakland Raiders",
    "value": 0
  },
  {
    "source": "New York Jets",
    "target": "Baltimore Colts",
    "value": 1
  },
  {
    "source": "Kansas City Chiefs",
    "target": "Minnesota Vikings",
    "value": 1
  },
  {
    "source": "Baltimore Colts",
    "target": "Dallas Cowboys",
    "value": 1
  },
  {
    "source": "Dallas Cowboys",
    "target": "Miami Dolphins",
    "value": 0
  },
  {
    "source": "Miami Dolphins",
    "target": "Washington Redskins",
    "value": 1
  },
  {
    "source": "Miami Dolphins",
    "target": "Minnesota Vikings",
    "value": 1
  },
  {
    "source": "Pittsburgh Steelers",
    "target": "Minnesota Vikings",
    "value": 1
  },
  {
    "source": "Pittsburgh Steelers",
    "target": "Dallas Cowboys",
    "value": 1
  },
  {
    "source": "Oakland Raiders",
    "target": "Minnesota Vikings",
    "value": 1
  },
  {
    "source": "Dallas Cowboys",
    "target": "Denver Broncos",
    "value": 0
  },
  {
    "source": "Pittsburgh Steelers",
    "target": "Los Angeles Rams",
    "value": 1
  },
  {
    "source": "Oakland Raiders",
    "target": "Philadelphia Eagles",
    "value": 1
  },
  {
    "source": "San Francisco 49ers",
    "target": "Cincinnati Bengals",
    "value": 0
  },
  {
    "source": "Washington Redskins",
    "target": "Miami Dolphins",
    "value": 0
  },
  {
    "source": "Los Angeles Raiders",
    "target": "Washington Redskins",
    "value": 1
  },
  {
    "source": "San Francisco 49ers",
    "target": "Miami Dolphins",
    "value": 0
  },
  {
    "source": "Chicago Bears",
    "target": "New England Patriots",
    "value": 0
  },
  {
    "source": "New York Giants",
    "target": "Denver Broncos",
    "value": 0
  },
  {
    "source": "Washington Redskins",
    "target": "Denver Broncos",
    "value": 0
  },
  {
    "source": "San Francisco 49ers",
    "target": "Denver Broncos",
    "value": 0
  },
  {
    "source": "New York Giants",
    "target": "Buffalo Bills",
    "value": 0
  },
  {
    "source": "Washington Redskins",
    "target": "Buffalo Bills",
    "value": 0
  },
  {
    "source": "Dallas Cowboys",
    "target": "Buffalo Bills",
    "value": 0
  },
  {
    "source": "San Francisco 49ers",
    "target": "San Diego Chargers",
    "value": 0
  },
  {
    "source": "Dallas Cowboys",
    "target": "Pittsburgh Steelers",
    "value": 0
  },
  {
    "source": "Green Bay Packers",
    "target": "New England Patriots",
    "value": 0
  },
  {
    "source": "Denver Broncos",
    "target": "Green Bay Packers",
    "value": 1
  },
  {
    "source": "Denver Broncos",
    "target": "Atlanta Falcons",
    "value": 1
  },
  {
    "source": "St. Louis Rams",
    "target": "Tennessee Titans",
    "value": 0
  },
  {
    "source": "Baltimore Ravens",
    "target": "New York Giants",
    "value": 1
  },
  {
    "source": "New England Patriots",
    "target": "St. Louis Rams",
    "value": 1
  },
  {
    "source": "Tampa Bay Buccaneers",
    "target": "Oakland Raiders",
    "value": 0
  },
  {
    "source": "New England Patriots",
    "target": "Carolina Panthers",
    "value": 1
  },
  {
    "source": "New England Patriots",
    "target": "Philadelphia Eagles",
    "value": 1
  },
  {
    "source": "Pittsburgh Steelers",
    "target": "Seattle Seahawks",
    "value": 1
  },
  {
    "source": "Indianapolis Colts",
    "target": "Chicago Bears",
    "value": 1
  },
  {
    "source": "New York Giants",
    "target": "New England Patriots",
    "value": 0
  },
  {
    "source": "Pittsburgh Steelers",
    "target": "Arizona Cardinals",
    "value": 1
  },
  {
    "source": "New Orleans Saints",
    "target": "Indianapolis Colts",
    "value": 0
  },
  {
    "source": "Green Bay Packers",
    "target": "Pittsburgh Steelers",
    "value": 0
  },
  {
    "source": "Baltimore Ravens",
    "target": "San Francisco 49ers",
    "value": 1
  },
  {
    "source": "Seattle Seahawks",
    "target": "Denver Broncos",
    "value": 0
  },
  {
    "source": "New England Patriots",
    "target": "Seattle Seahawks",
    "value": 1
  },
  {
    "source": "Denver Broncos",
    "target": "Carolina Panthers",
    "value": 1
  },
  {
    "source": "New England Patriots",
    "target": "Atlanta Falcons",
    "value": 1
  },
  {
    "source": "Philadelphia Eagles",
    "target": "New England Patriots",
    "value": 0
  }
];
var nodes = {};
// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source, value: link.value});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target, value: link.value});
});
var width = 1200,
    height = 700;
var force = d3.forceSimulation()
    .nodes(d3.values(nodes))
    .force("link", d3.forceLink(links).distance(60))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("charge", d3.forceManyBody().strength(-250))
    .alphaTarget(1)
    .on("tick", tick);
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
// add the links and the arrows
var path = svg.append("g")
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("class", function(d) { return "link " + d.type; });

var g = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g");
// define the nodes
var node = g
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
      );
// add the nodes
node.append("circle")
    // Part d
    .attr("class", "unpinned")
    .attr("r", 5);


/**
 * Part a
 * Adding node labels
 * takeaway: append first then set text
 *           read the d data structure first
 */
node.append("text")
    .text(function(d) { return d.name; });


/**
 * Part b
 * Styling links
 * takeaway: d is undefined.. use callback
 *           http-server -c-1 to avoid caching hence not updating files
 *           use .attr("class", "className") to override/replace default link style
 *           d3.selectAll is preferred
 */
d3.selectAll("path").attr("class", function(d) { 
  return d.value == 0 ? "zero" : "one"; 
});
// d3.selectAll("path").classed("zero", function(d) { return d.value == 0; });
// d3.selectAll("path").classed("one", function(d) { return d.value == 1; });


/**
 * Part c
 * Scaling node sizes
 * takeaway: read data structures to fit on the format
 */
// var _degrees = links
//     .flatMap(object => [object.source.name, object.target.name]);
var outDegrees = d3.nest()
    .key(d => d.source.name)
    .rollup(v => v.length)
    .entries(links);
var inDegrees = d3.nest()
    .key(d => d.target.name)
    .rollup(v => v.length)
    .entries(links);
var degrees = d3.nest()
    .key(d => d.key)
    .rollup(d => d3.sum(d, g => g.value))
    .entries([...inDegrees, ...outDegrees]);
var rScale = d3.scalePow()
    .exponent(2)
    .domain([1, d3.max( d3.values(degrees).map(deg => deg.value) )])
    .range([5, 20]);
d3.selectAll("circle")
    .attr("r", d => rScale( degrees.filter(deg => deg.key == d.name)[0].value ) );


/**
 * Part d
 * Pinning nodes
 * takeaway: we do not modify data update/exit for forceSimulation, because flagging is enough, no points are to be dismissed
 *           css class no need dot prefix
 */
node.on("dblclick", node => handlePinning(node)) // generalised node apply changes to every node
function handlePinning(_node) {
  var circle = d3.selectAll("circle").filter(d => d.name == _node.name);

  if (!d3.event.active) force.alphaTarget(0);
  if (_node.fixed) {
    _node.fixed = false;

    // Stabilises
    _node.fx = null;
    _node.fy = null;

    // Styles
    circle.attr("class", "unpinned");
  } else {
    _node.fixed = true;

    // Stabilises
    _node.fx = _node.x;
    _node.fy = _node.y;

    // Styles
    circle.attr("class", "pinned");
  }
}


// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });
    node
        .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; })
};
function dragstarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
};
function dragended(d) {
  if (!d3.event.active) force.alphaTarget(0);
  if (d.fixed == true){
     d.fx = d.x;
     d.fy = d.y;
  }
  else{
    d.fx = null;
    d.fy = null;
  }
};