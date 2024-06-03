function updateBiplot(standardizedData, scores, loadings, components, eigenvalues, explained_variance_ratio, principalComponents, featureNames, labels) {

    console.log("Here in the biplot part");
    console.log("scores are - ", scores);
    console.log("loadings are - ", loadings);
    console.log("eigenvalues are - ", eigenvalues);
    console.log("PC's are - ", principalComponents);
    console.log("features are - ", featureNames);
    console.log("Components - ", components)
    console.log("Labels - ", labels)

    // colors = ['steelblue', 'red', 'gold', 'lime', 'teal', 'fuschia', 'saddlebrown', 'indigo', 'olive', 'navy']
    colors = d3.scaleOrdinal(d3.schemeCategory10);
    data = scores;

    // Number of principal components to consider
    numComponents = principalComponents; // Change this as needed

    // SVG dimensions
    const svgWidth = 600;
    const svgHeight = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;


    d3.select('#Biplot').remove();
    // Create SVG container

    let svg = d3.select("#KMeansMSECol").append("div")
        .attr("id", "Biplot")
        .attr("class", "bg-light m-1 col-5")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

    // Create scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([-15, 15])
        .range([-width / 2, width / 2]);

    const yScale = d3.scaleLinear()
        .domain([-15, 15])
        .range([height / 2, -height / 2]);

    // Create x and y axes with ticks of 1
    const xAxis = d3.axisBottom(xScale).ticks(9);
    const yAxis = d3.axisLeft(yScale).ticks(14);

    // Append x and y axes to the SVG
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + (-width / 2) + ",0)")
        .call(yAxis);

    // Plot data points with random jittering
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[0])) // Add random jitter to x coordinate
        .attr("cy", d => yScale(d[1])) // Add random jitter to y coordinate
        .attr("r", 1.5)
        .style("fill", (d, i) => colors([labels[i]])); // Adjust color as needed


    svg.append('text')
        .attr('x', width / 10)
        .attr('y', height -215)
        .attr('text-anchor', 'middle')
        .text('PRINCIPAL COMPONENT 1');

    svg.append('text')  
        .attr('x', height / 2 - 230)
        .attr('y', margin.left/2 - 305)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('PRINCIPAL COMPONENT 2');

    svg.append('text')
        .attr('x', width / 20 - 50)
        .attr('y', -280)
        .attr('text-anchor', 'middle')
        .text('BIPLOT WITH TOP 4 VARIABLE VECTORS');

    // Plot principal component vectors with labels
    components.forEach((component, i) => {
        // Multiply coordinates by 2 to increase the length of vectors
        const x2 = component[0] * 50;
        const y2 = component[1] * 50;

        svg.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", xScale(x2))
            .attr("y2", yScale(y2))
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Add labels for principal components
        svg.append("text")
            .attr("x", xScale(x2))
            .attr("y", yScale(y2))
            .text(`${featureNames[i]}`)
            .attr("dy", -10) // Adjust label position
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "black");
    });


    // Draw a black border box around the SVG at the end
    svg.append("rect")
        .attr("x", 0 - svgWidth/2)
        .attr( "y", 0 - svgHeight/2)
        .attr("width", svgWidth-2) // Adjusted width
        .attr("height", svgHeight-2) // Adjusted height
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 2);
}


function LoadingsTable(features, loadingsData, knee, sumofSqLoadings) {
    // SVG dimensions
    const svgWidth = 600;
    const svgHeight = 600;
    const margin = { top: 12, right: 50, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Remove existing table container
    d3.select('#table-container').remove();

    let hh = d3.select("#graph-container").append("div")
                .attr("id", "Loadings")
                .attr("class", "bg-light row justify-content-evenly"); 

    // let ll = d3.select("#Loadings").append("div")
    //             .attr("id", "LoadingsTable")
    //             .attr("class", "bg-light m-1 col-5")
    // Create SVG container
    let container = d3.select("#Loadings")
        .append("div")
        .attr("id", "table-container")
        .attr("class", "bg-light col-5");

    // Create the table using D3.js
    var table = container.append("table");

// Add table header
    var thead = table.append("thead").text("Loadings Table");
    var headerRow = thead.append("tr");

    headerRow.append("th").text("Variable").attr("style", "border: 1px solid #dddddd; text-align: left; padding: 8px;");
    for (var i = 1; i <= knee; i++) {
        headerRow.append("th").text("PC" + i).attr("style", "border: 1px solid #dddddd; text-align: center; padding: 8px;");
    }
    headerRow.append("th").text("Sum of Sq Loadings").attr("style", "border: 1px solid #dddddd; text-align: center; padding: 8px;");

    // Add table body
    var tbody = table.append("tbody");
    features.forEach(function (feature, rowIndex) {
        var row = tbody.append("tr");
        row.append("td").text(feature).attr("style", "border: 1px solid #dddddd; text-align: left; padding: 8px;");

        for (var i = 0; i < knee; i++) {
            row.append("td").text(loadingsData[rowIndex][i].toFixed(4)).attr("style", "border: 1px solid #dddddd; text-align: center; padding: 8px;");
        }
        row.append("td").text(sumofSqLoadings[rowIndex].toFixed(4)).attr("style", "border: 1px solid #dddddd; text-align: center; padding: 8px;");
    });
}
