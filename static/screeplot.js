let elbowIndex = 0;
let Kmeans = 0;
let idi = 0;

function updateScreePlot(eigenvalues, explainedVariance, knee) {
    // Clear the existing scree plot
    d3.select('#graph-container').remove();

    const svgWidth = 600;
    const svgHeight = 600;
    const margin = { top: 10, right: 20, bottom: 60, left: 100 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const kk = d3.select('#graph-container').remove();
    let barGraphContainer = d3.select("#chart").append("div")
                            .attr("id", "graph-container")
                            .attr("class", "bg-light m-1");

    let hh = d3.select("#graph-container").append("div")
                .attr("id", "EigenBarsCol")
                .attr("class", "bg-light row justify-content-evenly");                   

    let gg = d3.select("#EigenBarsCol").append("div")
                .attr("id", "EigenBars")
                .attr("class", "bg-light m-1 col-5")

                
    const svg = d3.select('#EigenBars')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Use a linear scale for the y-axis
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(eigenvalues)+2])
        .range([height, 30]);

    // Use a band scale for the x-axis
    var xScale = d3.scaleBand()
        .domain(d3.range(1, eigenvalues.length+1))
        .range([0, width])
        .padding(0.1);

    // Create X and Y axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).tickValues(d3.range(0, d3.max(eigenvalues)+2), 4); // Format ticks as desired, .2s will use SI-prefix formatting

    // Append X and Y axes to the SVG
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 20)
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(0)")
        .style("text-anchor", "start");

    svg.append("g")
        .call(yAxis);

    // Create a bar chart for eigenvalues
    var barChart = svg.selectAll('rect')
        .data(eigenvalues)
        .enter().append('rect')
        .attr('id', 'myGroup')
        .attr('x', function (d, i) { return xScale(i+1); })
        .attr('y', function (d) { return yScale(d); })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return height - yScale(d); })
        .attr('fill', function (d,i){ if(i==knee){if(Kmeans == 0){
            Kmeans = i+1  
         }
         idi = i+1
         biplot(idi, Kmeans);return 'orange'}else{return 'steelblue'}});

    // Add labels and title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom-15)
        .attr('text-anchor', 'middle')
        .text('Principal Components');

    svg.append('text')
        .attr('x', -height / 2)
        .attr('y', margin.left/2 - 85)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Eigenvalues');

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .text('SCREEPLOT - RED DOT IS ELBOW POINT');


    // Draw lines and highlight elbow point
    var line = d3.line()
        .x(function (d, i) { return xScale(i+1) + xScale.bandwidth() / 2; })
        .y(function (d) { return yScale(d); });

    svg.selectAll(".line")
        .data(eigenvalues.slice(1)) // Start from the second point
        .enter().append("line")
        .attr("class", "line")
        .attr("x1", function (d, i) { return xScale(i+1) + xScale.bandwidth() / 2; })
        .attr("y1", function (d, i) { return yScale(eigenvalues[i]); })
        .attr("x2", function (d, i) { return xScale(i+2) + xScale.bandwidth() / 2; }) // Connect to the next point
        .attr("y2", function (d) { return yScale(d); })
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // Highlight the elbow point with a red dot
    // var elbowIndex = findElbowPoint(eigenvalues);

    elbowIndex = knee // Find the elbow point index (you need to implement this function)
    svg.append("circle")
        .attr("cx", xScale(elbowIndex + 1) + xScale.bandwidth() / 2)
        .attr("cy", yScale(eigenvalues[elbowIndex]))
        .attr("r", 5)
        .attr("fill", "red");

    // Add interaction element (e.g., click event for selecting intrinsic dimensionality)
    barChart.on('click', function (d, i) {
        // Implement your logic for handling the click event   
        var currentColor = d3.select(this).attr('fill');
        
        barChart.attr('fill', 'steelblue')

        // Change fill color to orange if currently steelblue
        d3.select(this).attr('fill', 'orange');
        console.log('Selected bar ' + (i+1));
        console.log("value is - " + eigenvalues[i]);
        // showTooltip(svg, i, eigenvalues);
        // showTooltip(d3.select('#EigenBars'), i, eigenvalues);
        if(Kmeans == 0){
           Kmeans = i+1  
        }
        idi = i+1
        biplot(idi, Kmeans);


    });

    var selectedRect = barChart.filter(function(d, i) {
        return i === elbowIndex;
    });
    // simulateMouseClick(selectedRect);

    // Draw a black border box around the SVG at the end
    svg.append("rect")
        .attr("x", 0-80)
        .attr( "y", 0-5)
        .attr("width", svgWidth-20) // Adjusted width
        .attr("height", svgHeight-5) // Adjusted height
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 2);
    
}


function plotkMeansMSE(kMeansMSE) {
    rectColor = 'steelblue'
    // Clear the existing scree plot
    const svgWidth = 600;
    const svgHeight = 600;
    const margin = { top: 10, right: 20, bottom: 60, left: 100 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    let hh = d3.select("#graph-container").append("div")
                .attr("id", "KMeansMSECol")
                .attr("class", "bg-light row justify-content-evenly"); 

    let ll = d3.select("#KMeansMSECol").append("div")
                .attr("id", "kMeansMSE")
                .attr("class", "bg-light m-1 col-5")                        

    const svg = d3.select('#kMeansMSE')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Use a linear scale for the y-axis
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(kMeansMSE)+2])
        .range([height, 30]);

    // Use a band scale for the x-axis
    var xScale = d3.scaleBand()
        .domain(d3.range(1, kMeansMSE.length+1))
        .range([0, width])
        .padding(0.1);

    // Create X and Y axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).tickValues(d3.range(0, d3.max(kMeansMSE)+2), 4); // Format ticks as desired, .2s will use SI-prefix formatting

    // Append X and Y axes to the SVG
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 20)
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(0)")
        .style("text-anchor", "start");

    svg.append("g")
        .call(yAxis);

    // Create a bar chart for eigenvalues
    var barChart = svg.selectAll('rect')
        .data(kMeansMSE)
        .enter().append('rect')
        .attr('id', 'myGroup')
        .attr('x', function (d, i) { return xScale(i+1); })
        .attr('y', function (d) { return yScale(d); })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return height - yScale(d); })
        .attr('fill', function (d,i){ if(i==elbowIndex){Kmeans = i+1;
            if(idi == 0){
               idi = elbowIndex+1
            }
            biplot(idi, Kmeans);return 'orange'}else{return 'steelblue'}});

    // Add labels and title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom-10)
        .attr('text-anchor', 'middle')
        .text('K Value of Clusters');

    svg.append('text')
        .attr('x', -height / 2)
        .attr('y', margin.left/2 - 85)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Mean Squared Errors');

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('K-MEANS MEAN SQUARED ERRORS');


    svg.append("circle")
        .attr("cx", xScale(elbowIndex + 1) + xScale.bandwidth() / 2)
        .attr("cy", yScale(kMeansMSE[elbowIndex]))
        .attr("r", 5)
        .attr("fill", "red");
  

    // Add interaction element (e.g., click event for selecting intrinsic dimensionality)
    barChart.on('click', function (d, i) {
        // Implement your logic for handling the click event   
        var currentColor = d3.select(this).attr('fill');
        
        barChart.attr('fill', 'steelblue')

        // Change fill color to orange if currently steelblue
        d3.select(this).attr('fill', 'orange');
        console.log('Selected k ' + (i+1));
        console.log("value is - " + kMeansMSE[i]);
        // showTooltip(svg, i, eigenvalues);
        // showTooltip(d3.select('#EigenBars'), i, eigenvalues);
        Kmeans = i+1;
        if(idi == 0){
           idi = elbowIndex+1
        }
        biplot(idi, Kmeans)

    });

    svg.append("rect")
        .attr("x", 0-80)
        .attr( "y", 0-5)
        .attr("width", svgWidth-20) // Adjusted width
        .attr("height", svgHeight-5) // Adjusted height
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 2);

    
    
}


// screeplot.js

function plotScree(eigenvalues) {
    // Clear existing scree plot
    // d3.select('#graph-container').remove();

    const svgWidth = 600;
    const svgHeight = 600;
    const margin = { top: 30, right: 20, bottom: 60, left: 100 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // const kk = d3.select('#graph-container').remove();
    // let barGraphContainer = d3.select("#chart").append("div")
    //                         .attr("id", "graph-container")
    //                         .attr("class", "bg-light m-3");


    let ll = d3.select("#EigenBarsCol").append("div")
                .attr("id", "EigenScree")
                .attr("class", "bg-light m-1 col-5")                        

    const svg = d3.select('#EigenScree')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate the percentage of total variance explained
    var totalVariance = d3.sum(eigenvalues);
    var explainedVariance = eigenvalues.map(value => (value / totalVariance) * 100);

    // Create a cumulative array for explained variance
    var cumulativeVariance = explainedVariance.reduce((acc, value, i) => acc.concat((acc.length > 0 ? acc[acc.length - 1] : 0) + value), []);

    // Use a linear scale for the y-axis
    var yScale = d3.scaleLinear()
        .domain([0, 100]) // Percentage scale
        .range([height, 0]);

    // Use a band scale for the x-axis
    var xScale = d3.scaleBand()
        .domain(d3.range(1, eigenvalues.length+1))
        .range([0, width])
        .padding(0.1);

    // Create X and Y axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).ticks(10);
    var ryaxis = d3.axisLeft(yScale).ticks(10);

    // Append X and Y axes to the SVG
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 20)
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(0)")
        .style("text-anchor", "start");

    svg.append("g")
        .call(yAxis);


    // Create a line for cumulative variance
    var line = d3.line()
        .x(function (d, i) { return xScale(i+1) + xScale.bandwidth() / 2; })
        .y(function (d) { return yScale(d); });

    // Append bars for explained variance
    svg.selectAll('rect')
        .data(explainedVariance)
        .enter().append('rect')
        .attr('x', function (d, i) { return xScale(i+1); })
        .attr('y', function (d) { return yScale(d); })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return height - yScale(d); })
        .attr('fill', 'steelblue');

    // Append line for cumulative variance
    svg.append("path")
        .datum(cumulativeVariance)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add side borders
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    svg.append("line")
        .attr("x1", width)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-width", 2);



    svg.selectAll(".tick line")
    .each(function () {
        var tickClone = d3.select(this.cloneNode(true));
        tickClone.attr("transform", "translate(" + width + ",0)");
        svg.node().appendChild(tickClone.node());
    });


    // Add labels and title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 20)
        .attr('text-anchor', 'middle')
        .text('Principal Components');

    svg.append('text')
        .attr('x', -height / 2)
        .attr('y',  margin.left/2 -85)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Percentage of Variance Explained');

    svg.append('text')
        .attr('x', width / 2 - 30)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .text('CUMULATIVE VARIANCE AS CURVE');


    // Add interaction element (e.g., click event for selecting intrinsic dimensionality)
    svg.selectAll('rect').on('click', function (d, i) {
        // Implement your logic for handling the click event
        console.log('Clicked on bar ' + i);
    });

    svg.append("rect")
        .attr("x", 0-80)
        .attr( "y", 0-30)
        .attr("width", svgWidth-20) // Adjusted width
        .attr("height", svgHeight-5) // Adjusted height
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 2);
}


// Function to find the elbow point index (you may need to adjust this based on your specific criteria)
function findElbowPoint(data) {
    var maxChange = 0;
    var elbowIndex = 0;

    for (var i = 0; i < data.length-2; i++) {
        var change = Math.abs((data[i+3] - data[i+2])-(data[i+2] - data[i+1])); // Calculate the absolute change in slope

        if (change > maxChange) {
            maxChange = change;
            elbowIndex = i+1;
        }
    }
    console.log("ElbowIndex is - ", elbowIndex)
    return elbowIndex;
}

function showTooltip(container, index, eigenvalues) {
    var tooltip = container.append('div')
        .attr('id', 'tooltip')
        .style('background-color', 'black')
        .style('border', '1px solid black')
        .style('padding', '10px')
        .style('border-radius', '5px')

    var xPos = d3.event.pageX;
    var yPos = d3.event.pageY;

    tooltip.style('left', (xPos + 30) + 'px')
        .style('top', (yPos - 30) + 'px');

    tooltip.html(`
        <div class="d-grid pt-4">
            <p class="toolTippara" id="choosesnIDI">Chosen IDI -  ${index+1}</p>
            <p class="toolTippara">Value: ${eigenvalues[index]}</p>
            <button class="btn btn-primary" type="button" id="plot-biplot-button" value="${index+1}">PLOT BIPLOT FOR SELECTED IDI</button>
        </div>
    `);

    // Close the tooltip on button click
    tooltip.select('#plot-biplot-button').on('click', function () {
        biplot(index+1);
    });

}

function biplot(idi, k){
    $('#loader').show();
    $.ajax({
        url: '/biplot',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
                              'IDIval': idi,
                              'knee': elbowIndex,
                              'kMean': k
                              }),
        dataType: 'json',                          
        success: function(response){
          console.log("In Success Part of ScreePlot")
          console.log(response)
          updateBiplot(response["data"], response["scores"], response["loadings"], response["components"], response["eigenvalues"], response["explained_variance_ratio"], response["IDIval"], response["featureNames"], response["labels"])
          LoadingsTable(response["AllFeatures"], response["loadings"], response["knee"], response["sumofSqLoadings"])
          updateScatterplotMatrix(response["top4Data"], response["featureNames"], response["labels"])
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('AJAX Error:', textStatus, errorThrown);
          console.log(jqXHR.responseText); // Log the detailed error response
        },
        complete: function () {
            // Hide loader when the AJAX request is complete (whether it was successful or not)
            $('#loader').hide();
          }
      });
}


// Function to simulate a mouse click on a specified element
function simulateMouseClick(element) {
    if (element) {
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    } else {
        console.error('Invalid element or element does not support dispatchEvent');
    }
}







