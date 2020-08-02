// svg area to work in

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// you can reference chartGroup later to append additional elements to the chart

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// we have to do chosen x and y axis because we want the chart to be dynamic

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// conditional statements to call each one of the x and y axis labels for the chart

var xLabel;
var yLabel;
if (chosenXAxis === "poverty") {
  xLabel = "Poverty:";
}
else if (chosenXAxis === "age") {
  xLabel = "Age:";
}
else {
  xLabel = "Median Income:";
}

if (chosenYAxis === "obesity") {
  yLabel = "Obesity:";
}
else if (chosenYAxis === "smokes") {
  yLabel = "Smokes:";
}
else {
  yLabel = "Lacks Healthcare:";
}

var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60]) // this position may need to be changed, you can add style to this line
.html(function(d) {
  // add a condition for the 3 possible tool tip formats which are dependent on the choosen x axis labels (% sign, no sign and $ sign)
  return (`${d.state}<hr>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
});

// now append to the tooltip, call the tooltip onto the circles
svg.call(toolTip);

function xScale(paperData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(paperData, d => d[chosenXAxis]) * 0.8,
        d3.max(paperData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

function yScale(paperData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(paperData, d => d[chosenYAxis]) * 0.8,
        d3.max(paperData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

  // to render now

  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// to render circles now

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newXScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// to add text to center of circle

function renderCirclesText(circlesTextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesTextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newXScale(d[chosenYAxis]));
  
    return circlesTextGroup;
  }

  // tooltip function

  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {


  return circlesGroup;

}

  // start reading in data

  d3.csv("assets/data/data.csv").then(function(paperData, err) {
    if (err) throw err;

  // parse your data (float or integer)
  paperData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    // console.log(data);
  });

  // call x scale function to get x linear scale
  // call y scale function to get y linear scale
  var xLinearScale = xScale(paperData, chosenXAxis);
  var yLinearScale = yScale(paperData, chosenYAxis);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

  // append circles

  var circlesGroup = chartGroup.selectAll("circle")
  .data(paperData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 15)
  .classed("stateCircle", true)
  .attr("opacity", ".5")
    // handle the events (event listener)
  // .on("click", function(data) {
  //     toolTip.show(data);
  //   })
      // onmouseout event
  // .on("mouseout", function(data, index) {
  //       toolTip.hide(data);
  //     });

  // text in the middle circle
  var circlesTextGroup = chartGroup.selectAll()
  .data(paperData)
  .enter()
  .append("text")
  .text(d => (d.abbr))
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .classed("stateText", true)

  // everything will be inside of here moving forward

  // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty(%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for three y-axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

  var obesityLabel = yLabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -80)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obese(%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -60)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes(%)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare(%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x axis labels event listener
    xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(paperData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesText(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);

  // labels, determine which ones are choosen, have condition for both axis, 
  // update circles tool tip based on selection

});


