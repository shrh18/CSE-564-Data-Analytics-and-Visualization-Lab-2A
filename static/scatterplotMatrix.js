function updateScatterplotMatrix(data, featureNames, labels) {
    console.log("In ScatterPlotMatrix");
    console.log("Top4data - ", data);

    // Number of features to consider
    const numFeatures = featureNames.length;

    // SVG dimensions
    const svgWidth = 700;
    const svgHeight = 700;
    const margin = { top: 40, right: 20, bottom: 40, left: 40 }; // Increased margin for better spacing
    const subplotMargin = 25; // Margin around each subplot
    const subplotWidth = (svgWidth - margin.left - margin.right - (numFeatures - 1) * subplotMargin) / numFeatures;
    const subplotHeight = (svgHeight - margin.top - margin.bottom - (numFeatures - 1) * subplotMargin) / numFeatures;

    // Remove existing scatterplot matrix
    d3.select('#ScatterplotMatrix').remove();


    // let hh = d3.select("#Loadings").append("div")
    //             .attr("id", "scatter")
    //             .attr("class", "bg-light row justify-content-evenly");
    // Create SVG container
    let svg = d3.select("#Loadings").append("div")
        .attr("id", "ScatterplotMatrix")
        .attr("class", "bg-light col-6")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scales for x and y axes
    const xScale = d3.scaleLinear().range([0, subplotWidth]);
    const yScale = d3.scaleLinear().range([subplotHeight, 0]);

    // Create a color scale based on labels for cluster coloring
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw scatterplot matrix
    featureNames.forEach((featureX, indexX) => {
        featureNames.forEach((featureY, indexY) => {
            // Skip if features on both axes are the same
            isMiddleBoxbool = false;
            if (indexX === indexY) {
                isMiddleBoxbool = true;
            }
            else{
                isMiddleBoxbool = false;
            }

            // Set up the domain for x and y scales based on data
            xScale.domain(d3.extent(data, d => d[indexX])).nice();
            yScale.domain(d3.extent(data, d => d[indexY])).nice();


            // Create a subplot for each pair of features
            const subplot = svg.append("g")
                .attr("transform", "translate(" + (indexX * (subplotWidth + subplotMargin)) + "," + (indexY * (subplotHeight + subplotMargin)) + ")");

            // Check if it's the middle box
            const isMiddleBox = indexX === Math.floor(numFeatures / 2) && indexY === Math.floor(numFeatures / 2);

            // Place the feature names in the middle box without tick values and axes
            if (isMiddleBox || isMiddleBoxbool) {
                // Feature names in the middle box
                subplot.append("text")
                    .attr("x", subplotWidth / 2)
                    .attr("y", subplotHeight / 2)
                    .style("text-anchor", "middle")
                    .text(featureX);

                // subplot.append("text")
                //     .attr("transform", "rotate(-90)")
                //     .attr("y", -subplotMargin + 10)
                //     .attr("x", 0 - subplotHeight / 2)
                //     .attr("dy", "1em")
                //     .style("text-anchor", "middle")
                //     .text(featureY);
            } else {
                // Create scatterplot points within the subplot
                subplot.selectAll(".dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 0.5)  // Adjust the radius to your preference
                    .attr("cx", d => xScale(d[indexX]))
                    .attr("cy", d => yScale(d[indexY]))
                    .style("fill", (d, i) => colorScale(labels[i]));

                // Add x-axis for the subplot
                subplot.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + subplotHeight + ")")
                    .call(d3.axisBottom(xScale));

                // Add y-axis for the subplot
                subplot.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(yScale));
            }

            // Add a boundary around each subplot
            subplot.append("rect")
                .attr("width", subplotWidth)
                .attr("height", subplotHeight)
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", 1);
        });
    });

    // Draw a black border box around the SVG at the end
    rect = svg.append("rect")
        .attr("x", 0-30)
        .attr( "y", 0-30)
        .attr("width", svgWidth-10) // Adjusted width
        .attr("height", svgHeight-20) // Adjusted height
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 2);

    svg.append('text')
        .attr('x', 320)
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .text('SCATTERPLOT MATRIX FOR TOP 4 VARIABLES W.R.T TO SELECTED IDI');

}
