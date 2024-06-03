function createScatterplot(league, variable, xAxisVariable, yAxisVariable, totalGoals, leagues, allTeamsStats, allGoals, maxGoals, minGoals, LeagueAvgAge, LeaguePasses, LeagueFouls, LaLigaBin, PremierLeagueBin, Ligue1Bin, BundesligaBin, SerieABin) {
    console.log("In ScatterPlot")
    console.log(xAxisVariable)
    console.log(yAxisVariable)
    if(league == "ALL LEAGUES"){
        // Assuming you have a dataset with x and y coordinates
        let scatterData = [
            // { x: 10, y: 20 },
            // { x: 30, y: 40 },
            // { x: 50, y: 60 },
            // Add more data points as needed
        ];
        
        const scatterSvgWidth = 800;
        const scatterSvgHeight = 700;
        const scatterMargin = { top: 60, right: 20, bottom: 80, left: 100 };
        const scatterWidth = scatterSvgWidth - scatterMargin.left - scatterMargin.right;
        const scatterHeight = scatterSvgHeight - scatterMargin.top - scatterMargin.bottom;
        
        // Remove any existing SVG with the same ID
        const existingScatterSvg = d3.select('#graph-container');
        if (!existingScatterSvg.empty()) {
            existingScatterSvg.remove();
        }
        
        // Create a new container for the scatterplot
        let scatterContainer = d3.select("#chart").append("div")
            .attr("id", "graph-container")
            .attr("class", "bg-light m-3");
        
        // Create SVG for scatterplot
        const scatterSvg = d3.select('#graph-container')
            .append('svg')
            .attr('width', scatterSvgWidth)
            .attr('height', scatterSvgHeight)
            .append('g')
            .attr('transform', `translate(${scatterMargin.left},${scatterMargin.top})`);
        
        // Create scales for x and y axes
        const scatterXScale = d3.scaleLinear().range([0, scatterWidth]);
        const scatterYScale = d3.scaleLinear().range([scatterHeight, 0]);
        
        console.log("League Passes", LeaguePasses);

        console.log("allgoals - ", allGoals);
        console.log("total goals", totalGoals);


        const variableMap = {
            "TOTAL GOALS SCORED": "goals",
            "PASSES COMPLETED": "suc_pass",
            "TOTAL AGE OF TEAM": "total_age",
            "FOULS COMMITTED": "fouls",
            "PLAYER COUNT": "player_count"
        };
        
        if (variableMap.hasOwnProperty(xAxisVariable) && variableMap.hasOwnProperty(yAxisVariable)) {
            for (let i = 0; i < allGoals.length; i++) {
                scatterData.push({
                    x: allGoals[i][variableMap[xAxisVariable]],
                    y: allGoals[i][variableMap[yAxisVariable]]
                });
            }
        }

        console.log("Scatter data - ", scatterData);

        let title = "TOP 5 EUROPEAN LEAGUES STATISTICS";

        // Set domains for x and y scales based on data
        scatterXScale.domain([d3.min(scatterData, d => d.x)-(d3.min(scatterData, d => d.x)/2), d3.max(scatterData, d => d.x)+(d3.min(scatterData, d => d.x)/2)]);
        scatterYScale.domain([d3.min(scatterData, d => d.y)-(d3.min(scatterData, d => d.y)/2), d3.max(scatterData, d => d.y)+(d3.min(scatterData, d => d.y)/2)]);
        
        // Create circles for each data point
        // scatterSvg.selectAll('circle')
        //     .data(scatterData)
        //     .enter()
        //     .append('circle')
        //     .attr('cx', d => scatterXScale(d.x))
        //     .attr('cy', d => scatterYScale(d.y))
        //     .attr('r', 6) // Adjust radius as needed
        //     .attr('fill', 'steelblue');

        // scatterSvg.selectAll('circle')
        //     .data(scatterData)
        //     .enter()
        //     .append('circle')
        //     .attr('cx', d => scatterXScale(d.x))
        //     .attr('cy', scatterYScale(0))  // Start the circles from the bottom of the chart
        //     .attr('r', 0)  // Start the circles with zero radius
        //     .attr('fill', 'steelblue')
        //     .transition()  // Apply the transition
        //     .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
        //     .attr('cy', d => scatterYScale(d.y))  // Set the final y position
        //     .attr('r', 6);  // Set the final radius

        scatterSvg.selectAll('circle')
            .data(scatterData)
            .enter()
            .append('circle')
            .attr('cx', scatterXScale(0))  // Start the circles from the left of the chart
            .attr('cy', scatterYScale(0))  // Start the circles from the bottom of the chart
            .attr('r', 0)  // Start the circles with zero radius
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('cx', d => scatterXScale(d.x))  // Set the final x position
            .attr('cy', d => scatterYScale(d.y))  // Set the final y position
            .attr('r', 5);  // Set the final radius

        
        // Add x-axis
        scatterSvg.append('g')
            .call(d3.axisBottom(scatterXScale))
            .attr('transform', `translate(0,${scatterHeight})`);
        
        // Add y-axis
        scatterSvg.append('g')
            .call(d3.axisLeft(scatterYScale));
        

            
        // Add labels
        scatterSvg.append("text") // X-axis label
            .attr("x", scatterWidth / 2)
            .attr("y", scatterHeight + 45)
            .style("text-anchor", "middle")
            .text(xAxisVariable);
        
        scatterSvg.append("text") // Y-axis label
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -scatterHeight / 2)
            .style("text-anchor", "middle")
            .text(yAxisVariable);
        
        scatterSvg.append("text") // Title
            .attr("x", scatterWidth / 2)
            .attr("y", -25)
            .style("text-anchor", "middle")
            .text(title);
    }
    else{

        let scatterData = [];
        
        const scatterSvgWidth = 800;
        const scatterSvgHeight = 700;
        const scatterMargin = { top: 60, right: 20, bottom: 80, left: 100 };
        const scatterWidth = scatterSvgWidth - scatterMargin.left - scatterMargin.right;
        const scatterHeight = scatterSvgHeight - scatterMargin.top - scatterMargin.bottom;
        
        // Remove any existing SVG with the same ID
        const existingScatterSvg = d3.select('#graph-container');
        if (!existingScatterSvg.empty()) {
            existingScatterSvg.remove();
        }
        
        // Create a new container for the scatterplot
        let scatterContainer = d3.select("#chart").append("div")
            .attr("id", "graph-container")
            .attr("class", "bg-light m-3");
        
        // Create SVG for scatterplot
        const scatterSvg = d3.select('#graph-container')
            .append('svg')
            .attr('width', scatterSvgWidth)
            .attr('height', scatterSvgHeight)
            .append('g')
            .attr('transform', `translate(${scatterMargin.left},${scatterMargin.top})`);
        
        // Create scales for x and y axes
        const scatterXScale = d3.scaleLinear().range([0, scatterWidth]);
        const scatterYScale = d3.scaleLinear().range([scatterHeight, 0]);
        
        console.log("League Passes", LeaguePasses);

        console.log("allgoals - ", allGoals);
        console.log("leagues - ", leagues);

        const variableMap = {
            "TOTAL GOALS SCORED": "goals",
            "PASSES COMPLETED": "sucPass",
            "TOTAL AGE OF TEAM": "totalAge",
            "FOULS COMMITTED": "fouls",
            "PLAYER COUNT": "playerCount"
        };
        
        console.log("Before");
        if (variableMap.hasOwnProperty(xAxisVariable) && variableMap.hasOwnProperty(yAxisVariable) && leagues.includes(league)) {
            // for (let i = 0; i < allTeamsStats[league].length; i++) {
            //     scatterData.push({
            //         // x: allGoals[i][variableMap[xAxisVariable]],
            //         // y: allGoals[i][variableMap[yAxisVariable]]

            //         x: allTeamsStats[league][i][variableMap[xAxisVariable]],
            //         y: allTeamsStats[league][i][variableMap[yAxisVariable]]

            //     });
            // }

            const leagueName = league;
            // Access the team stats object for the specified league
            console.log("Before teamstats");
            const teamsStats = allTeamsStats.find(stats => Object.keys(stats)[0] === leagueName);
            console.log("Teamstats - ". teamsStats);
            if (teamsStats) {
                // Iterate over teams in the selected league
                for (const team in teamsStats[leagueName]) {
                    scatterData.push({
                        x: teamsStats[leagueName][team][variableMap[xAxisVariable]],
                        y: teamsStats[leagueName][team][variableMap[yAxisVariable]]
                    });
                }
            }
        }

        console.log("Scatter data - ", scatterData);

        let title = league.toUpperCase() + " LEAGUE STATISTICS";

        // Set domains for x and y scales based on data
        scatterXScale.domain([d3.min(scatterData, d => d.x)-(d3.min(scatterData, d => d.x)/2), d3.max(scatterData, d => d.x)+(d3.min(scatterData, d => d.x)/2)]);
        scatterYScale.domain([d3.min(scatterData, d => d.y)-(d3.min(scatterData, d => d.y)/2), d3.max(scatterData, d => d.y)+(d3.min(scatterData, d => d.y)/2)]);
        
        // Create circles for each data point
        // scatterSvg.selectAll('circle')
        //     .data(scatterData)
        //     .enter()
        //     .append('circle')
        //     .attr('cx', d => scatterXScale(d.x))
        //     .attr('cy', d => scatterYScale(d.y))
        //     .attr('r', 6) // Adjust radius as needed
        //     .attr('fill', 'steelblue');

        // scatterSvg.selectAll('circle')
        //     .data(scatterData)
        //     .enter()
        //     .append('circle')
        //     .attr('cx', d => scatterXScale(d.x))
        //     .attr('cy', scatterYScale(0))  // Start the circles from the bottom of the chart
        //     .attr('r', 0)  // Start the circles with zero radius
        //     .attr('fill', 'steelblue')
        //     .transition()  // Apply the transition
        //     .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
        //     .attr('cy', d => scatterYScale(d.y))  // Set the final y position
        //     .attr('r', 6);  // Set the final radius

        scatterSvg.selectAll('circle')
            .data(scatterData)
            .enter()
            .append('circle')
            .attr('cx', scatterXScale(0))  // Start the circles from the left of the chart
            .attr('cy', scatterYScale(0))  // Start the circles from the bottom of the chart
            .attr('r', 0)  // Start the circles with zero radius
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('cx', d => scatterXScale(d.x))  // Set the final x position
            .attr('cy', d => scatterYScale(d.y))  // Set the final y position
            .attr('r', 5);  // Set the final radius
        
        
        // Add x-axis
        scatterSvg.append('g')
            .call(d3.axisBottom(scatterXScale))
            .attr('transform', `translate(0,${scatterHeight})`);
        
        // Add y-axis
        scatterSvg.append('g')
            .call(d3.axisLeft(scatterYScale));
        
        // Add labels
        scatterSvg.append("text") // X-axis label
            .attr("x", scatterWidth / 2)
            .attr("y", scatterHeight + 45)
            .style("text-anchor", "middle")
            .text(xAxisVariable);
        
        scatterSvg.append("text") // Y-axis label
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -scatterHeight / 2)
            .style("text-anchor", "middle")
            .text(yAxisVariable);
        
        scatterSvg.append("text") // Title
            .attr("x", scatterWidth / 2)
            .attr("y", -25)
            .style("text-anchor", "middle")
            .text(title);
    }
  
}