// bargraph.js
function verticalBarGraph(league, variable, totalGoals, leagues, allTeamsStats, allGoals, maxGoals, minGoals, LeagueAvgAge, LeaguePasses, LeagueFouls){
    
    console.log("In Vertical Bargraph")
    
    if(league == 'ALL LEAGUES'){

         // Use D3.js to create a bar graph
        
    
        const svgWidth = 800;
        const svgHeight = 600;
        const margin = { top: 10, right: 20, bottom: 60, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const kk = d3.select('#graph-container').remove();
        let barGraphContainer = d3.select("#chart").append("div")
                                .attr("id","graph-container")
                                .attr("class", "bg-light m-3");

        const svg = d3.select('#graph-container')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand().range([0, width]).padding(0.1);
        const yScale = d3.scaleLinear().range([height, height-500]);

        let datasend = [];
        let tickval;
        let startVal;
        let extend;
        let title;
        let xAxisVariable;
        let yAxisVariable; 
        if(variable == "TOTAL GOALS SCORED"){
            datasend = totalGoals;
            tickval = 20;
            startVal = 800;
            extend = 50;
            title = "TOP 5 EUROPEAN LEAGUES VS TOTAL GOALS SCORED IN SEASON 2021-22";
            xAxisVariable = "LEAGUES";
            yAxisVariable = "TOTAL GOALS SCORED";
        }
        else if(variable == "AVERAGE AGE"){
            datasend = LeagueAvgAge;
            console.log("league Avg age : ", datasend);
            tickval = 0.5;
            startVal = 20;
            extend = 3;
            title = "TOP 5 EUROPEAN LEAGUES VS AVERAGE AGE OF PLAYERS IN LEAGUE IN SEASON 2021-22";
            xAxisVariable = "LEAGUES";
            yAxisVariable = "AVERAGE AGE OF PLEAYERS IN LEAGUE";
        }
        else if(variable == "PASSES COMPLETED"){
            LeaguePasses.forEach(element => {
                datasend.push(element/1000);
            });
            console.log("league passes completed : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 100;
            title = "TOP 5 EUROPEAN LEAGUES VS TOTAL PASSES COMPLETED IN SEASON 2021-22";
            xAxisVariable = "LEAGUES";
            yAxisVariable = "TOTAL PASSES COMPLETED IN 1000's";
        }
        else if(variable == "FOULS COMMITTED"){
            LeagueFouls.forEach(element => {
                datasend.push(element/100);
            });
            console.log("league fouls : ", datasend);
            tickval = 20;
            startVal = 0;
            extend = 15;
            title = "TOP 5 EUROPEAN LEAGUES VS TOTAL FOULS COMMITTED IN SEASON 2021-22";
            xAxisVariable = "LEAGUES";
            yAxisVariable = "TOTAL FOULS COMMITTED IN 100's";
        }

        xScale.domain(leagues);
        console.log(leagues)
        yScale.domain([startVal, d3.max(datasend)+extend]);

        // svg.selectAll('rect')
        //     .data(datasend)
        //     .enter()
        //     .append('rect')
        //     .attr('x', (d,i ) => xScale(leagues[i]))
        //     .attr('y', d => yScale(d))
        //     .attr('width', xScale.bandwidth())
        //     .attr('height', d => height - yScale(d))
        //     .attr('fill', 'steelblue');

        svg.selectAll('rect')
            .data(datasend)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(leagues[i]))
            .attr('y', height)  // Start the bars from the bottom of the chart
            .attr('width', xScale.bandwidth())
            .attr('height', 0)  // Start the bars with zero height
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('y', d => yScale(d))
            .attr('height', d => height - yScale(d));

        // const yAxis = d3.axisLeft(yScale).tickValues(d3.range(800, d3.max(totalGoals) + 200, 100)); // Set your desired step value

        svg.append("text")      // text label for the x axis
            .attr("x", width/2 )
            .attr("y",  35 )
            .style("text-anchor", "middle")
            .text(title);


        svg.append("text")      // text label for the x axis
            .attr("x", width/2 )
            .attr("y",  575 )
            .style("text-anchor", "middle")
            .text(xAxisVariable);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -290)
            // .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisVariable);

        // Add x-axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        // Add y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale).tickValues(d3.range(startVal, d3.max(datasend)+extend, tickval)));
    }
    else{

        const svgWidth = 1400;
        const svgHeight = 600;
        const margin = { top: 10, right: 20, bottom: 60, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const kk = d3.select('#graph-container').remove();
        let barGraphContainer = d3.select("#chart").append("div")
                                .attr("id","graph-container")
                                .attr("class", "bg-light m-3");

        const svg = d3.select('#graph-container')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand().range([0, width]).padding(0.2);
        const yScale = d3.scaleLinear().range([height, height-500]);

        console.log("Selected League - ", league)
        let selectedLeagueStats = allTeamsStats.find(obj => league in obj)[league];
        console.log("selectedLeagueStats : ", selectedLeagueStats)

        // Extract goals for each team in the selected league
        let selectedLeagueGoals = Object.values(selectedLeagueStats).map(team => team.goals);
        console.log("selectedLeagueGoals",selectedLeagueGoals);

        let selectedLeagueAges = Object.values(selectedLeagueStats).map(team => team.avgAge);
        let selectedLeaguePasses = Object.values(selectedLeagueStats).map(team => team.sucPass);
        let selectedLeagueFouls = Object.values(selectedLeagueStats).map(team => team.fouls);

        let selectedLeagueKeys = Object.keys(selectedLeagueStats);

        
        let datasend = [];
        let tickval;
        let startVal;
        let extend;
        if(variable == "TOTAL GOALS SCORED"){
            datasend = selectedLeagueGoals;
            tickval = 5;
            startVal = 0;
            extend = 20;
            title = "TEAMS IN " + league.toUpperCase() + " VS TOTAL GOALS SCORED IN SEASON 2021-22";
            xAxisVariable = "ALL TEAMS IN LEAGUE";
            yAxisVariable = "TOTAL GOALS SCORED";
        }
        else if(variable == "AVERAGE AGE"){
            datasend = selectedLeagueAges
            tickval = 0.5;
            startVal = 20;
            extend = 3;
            title = "TEAMS IN " + league.toUpperCase() + " VS AVERAGE AGE OF PLAYERS IN SEASON 2021-22";
            xAxisVariable = "ALL TEAMS IN LEAGUE";
            yAxisVariable = "AVERAGE AGE OF PLEAYERS IN TEAM";
        }
        else if(variable == "PASSES COMPLETED"){
            selectedLeaguePasses.forEach(element => {
                datasend.push(element/100);
            });
            console.log("league passes completed : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 100;
            title = "TEAMS IN " + league.toUpperCase() + " VS TOTAL PASSES COMPLETED IN SEASON 2021-22";
            xAxisVariable = "ALL TEAMS IN LEAGUE";
            yAxisVariable = "TOTAL PASSES COMPLETED IN 100's";
        }
        else if(variable == "FOULS COMMITTED"){
            selectedLeagueFouls.forEach(element => {
                datasend.push(element);
            });
            tickval = 50;
            startVal = 200;
            extend = 50;
            title = "TEAMS IN " + league.toUpperCase() + " VS TOTAL FOULS COMMITTED IN SEASON 2021-22";
            xAxisVariable = "ALL TEAMS IN LEAGUE";
            yAxisVariable = "TOTAL FOULS COMMITTED";
        }

        xScale.domain(selectedLeagueKeys);
        yScale.domain([startVal, d3.max(datasend)+extend]);
        
        // svg.selectAll('rect')
        //     .data(datasend)
        //     .enter()
        //     .append('rect')
        //     .attr('x', (d,i) => xScale(selectedLeagueKeys[i]))
        //     .attr('y', (d) => yScale(d))
        //     .attr('width', xScale.bandwidth())
        //     .attr('height', (d) => height - yScale(d))
        //     .attr('fill', 'steelblue');

        
        svg.selectAll('rect')
            .data(datasend)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(selectedLeagueKeys[i]))
            .attr('y', height)
            .attr('width', xScale.bandwidth())
            .attr('height', 0)  // Start the bars with zero height
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(2000)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('y', d => yScale(d))
            .attr('height', (d) => height - yScale(d));  // Set the final height


        // const yAxis = d3.axisLeft(yScale).tickValues(d3.range(800, d3.max(totalGoals) + 200, 100)); // Set your desired step value

        svg.append("text")      // text label for the x axis
            .attr("x", width/2 )
            .attr("y",  35 )
            .style("text-anchor", "middle")
            .text(title);


        svg.append("text")      // text label for the x axis
            .attr("x", width/2 )
            .attr("y",  575 )
            .style("text-anchor", "middle")
            .text(xAxisVariable);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -290)
            // .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisVariable);

        // Add x-axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        // Add y-axis

        svg.append('g')
            .call(d3.axisLeft(yScale).tickValues(d3.range(startVal, d3.max(datasend)+extend, tickval)));
    }
    

} 

function horizontalBarGraph(league, variable, totalGoals, leagues, allTeamsStats, allGoals, maxGoals, minGoals, LeagueAvgAge, LeaguePasses, LeagueFouls) {

    if(league == 'ALL LEAGUES'){
        const svgWidth = 1200;
        const svgHeight = 650;
        const margin = { top: 90, right: 20, bottom: 60, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const kk = d3.select('#graph-container').remove();
            let barGraphContainer = d3.select("#chart").append("div")
                                    .attr("id","graph-container")
                                    .attr("class", "bg-light m-3");

        const svg = d3.select('#graph-container')
            .append('svg') 
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleBand().range([height, 0]).padding(0.2);

        let datasend = [];
        let tickval;
        let startVal;
        let extend;
        let title;
        let xAxisVariable;
        let yAxisVariable; 
        if(variable == "TOTAL GOALS SCORED"){
            datasend = totalGoals;
            tickval = 20;
            startVal = 800;
            extend = 50;
            title = "TOP 5 EUROPEAN LEAGUES VS TOTAL GOALS SCORED IN SEASON 2021-22";
            xAxisVariable = "LEAGUES";
            yAxisVariable = "TOTAL GOALS SCORED";
        }
        else if(variable == "AVERAGE AGE"){
            datasend = LeagueAvgAge;
            console.log("league Avg age : ", datasend);
            tickval = 0.5;
            startVal = 20;
            extend = 3;
            title = "TOP 5 EUROPEAN LEAGUES VS AVERAGE AGE OF PLAYERS IN LEAGUE IN SEASON 2021-22";
            xAxisVariable = "LEAGUES";
            yAxisVariable = "AVERAGE AGE OF PLEAYERS IN LEAGUE";
        }
        else if(variable == "PASSES COMPLETED"){
            LeaguePasses.forEach(element => {
                datasend.push(element/1000);
            });
            console.log("league passes completed : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 100;
            title = "TOP 5 EUROPEAN LEAGUES VS TOTAL PASSES COMPLETED IN SEASON 2021-22";
            xAxisVariable = "LEAGUES";
            yAxisVariable = "TOTAL PASSES COMPLETED IN 1000's";
        }
        else if(variable == "FOULS COMMITTED"){
            LeagueFouls.forEach(element => {
                datasend.push(element/100);
            });
            console.log("league fouls : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 50;
            title = "TOP 5 EUROPEAN LEAGUES VS TOTAL FOULS COMMITTED IN SEASON 2021-22";
            xAxisVariable = "LEAGUES";
            yAxisVariable = "TOTAL FOULS COMMITTED IN 100's";
        }

        xScale.domain([startVal, d3.max(datasend) + extend]);
        yScale.domain(leagues);

        // svg.selectAll('rect')
        //     .data(datasend)
        //     .enter()
        //     .append('rect')
        //     .attr('x', 0) // For horizontal bar chart, x starts from 0
        //     .attr('y', (d, i) => yScale(leagues[i]))
        //     .attr('width', d => xScale(d))
        //     .attr('height', yScale.bandwidth())
        //     .attr('fill', 'steelblue');

        svg.selectAll('rect')
            .data(datasend)
            .enter()
            .append('rect')
            .attr('x', 0)  // For horizontal bar chart, x starts from 0
            .attr('y', (d, i) => yScale(leagues[i]))
            .attr('width', 0)  // Start the bars with zero width
            .attr('height', yScale.bandwidth())
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('width', d => xScale(d))  // Set the final width
            .attr('x', 0);  // Set the final x position
        

        svg.append("text") // text label for the x axis
            .attr("x", width/2)
            .attr("y", -50)
            .style("text-anchor", "middle")
            .text(title);

        svg.append("text") // text label for the x axis
            .attr("x", width/2)
            .attr("y", 545)
            .style("text-anchor", "middle")
            .text(yAxisVariable);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -70)
            .attr("x", -220)
            .style("text-anchor", "middle")
            .text(xAxisVariable);

        // Add x-axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickValues(d3.range(startVal, d3.max(datasend) + extend, tickval)));

        // Add y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale));
    }
    else{
        const svgWidth = 1100;
        const svgHeight = 600;
        const margin = { top: 40, right: 20, bottom: 60, left: 150 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const kk = d3.select('#graph-container').remove();
            let barGraphContainer = d3.select("#chart").append("div")
                                    .attr("id","graph-container")
                                    .attr("class", "bg-light m-3");

        const svg = d3.select('#graph-container')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleBand().range([height, 0]).padding(0.2);

        let selectedLeagueStats = allTeamsStats.find(obj => league in obj)[league];
        let selectedLeagueGoals = Object.values(selectedLeagueStats).map(team => team.goals);
        let selectedLeagueAges = Object.values(selectedLeagueStats).map(team => team.avgAge);
        let selectedLeaguePasses = Object.values(selectedLeagueStats).map(team => team.sucPass);
        let selectedLeagueFouls = Object.values(selectedLeagueStats).map(team => team.fouls);

        let selectedLeagueKeys = Object.keys(selectedLeagueStats);

        let datasend = [];
        let tickval;
        let startVal;
        let extend;
        if(variable == "TOTAL GOALS SCORED"){
            datasend = selectedLeagueGoals;
            tickval = 5;
            startVal = 0;
            extend = 20;
            title = "TEAMS IN " + league.toUpperCase() + " VS TOTAL GOALS SCORED IN SEASON 2021-22";
            xAxisVariable = "ALL TEAMS IN LEAGUE";
            yAxisVariable = "TOTAL GOALS SCORED";
        }
        else if(variable == "AVERAGE AGE"){
            datasend = selectedLeagueAges
            tickval = 0.5;
            startVal = 20;
            extend = 3;
            title = "TEAMS IN " + league.toUpperCase() + " VS AVERAGE AGE OF PLAYERS IN SEASON 2021-22";
            xAxisVariable = "ALL TEAMS IN LEAGUE";
            yAxisVariable = "AVERAGE AGE OF PLEAYERS IN TEAM";
        }
        else if(variable == "PASSES COMPLETED"){
            selectedLeaguePasses.forEach(element => {
                datasend.push(element/100);
            });
            console.log("league passes completed : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 100;
            title = "TEAMS IN " + league.toUpperCase() + " VS TOTAL PASSES COMPLETED IN SEASON 2021-22";
            xAxisVariable = "ALL TEAMS IN LEAGUE";
            yAxisVariable = "TOTAL PASSES COMPLETED IN 100's";
        }
        else if(variable == "FOULS COMMITTED"){
            selectedLeagueFouls.forEach(element => {
                datasend.push(element);
            });
            tickval = 50;
            startVal = 200;
            extend = 50;
            title = "TEAMS IN " + league.toUpperCase() + " VS TOTAL FOULS COMMITTED IN SEASON 2021-22";
            xAxisVariable = "ALL TEAMS IN LEAGUE";
            yAxisVariable = "TOTAL FOULS COMMITTED";
        }

        xScale.domain([startVal, d3.max(datasend) + extend]);
        yScale.domain(selectedLeagueKeys);

        // svg.selectAll('rect')
        //     .data(datasend)
        //     .enter()
        //     .append('rect')
        //     .attr('x', 0) // For horizontal bar chart, x starts from 0
        //     .attr('y', (d,i) => yScale(selectedLeagueKeys[i]))
        //     .attr('width', d => xScale(d))
        //     .attr('height', yScale.bandwidth())
        //     .attr('fill', 'steelblue');

        svg.selectAll('rect')
            .data(datasend)
            .enter()
            .append('rect')
            .attr('x', 0)  // For horizontal bar chart, x starts from 0
            .attr('y', (d, i) => yScale(selectedLeagueKeys[i]))
            .attr('width', 0)  // Start the bars with zero width
            .attr('height', yScale.bandwidth())
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('width', d => xScale(d))  // Set the final width
            .attr('x', 0);  // Set the final x position

        svg.append("text") // text label for the x axis
            .attr("x", width/2)
            .attr("y", -10)
            .style("text-anchor", "middle")
            .text(title);

        svg.append("text") // text label for the x axis
            .attr("x", width/2)
            .attr("y", 545)
            .style("text-anchor", "middle")
            .text(yAxisVariable);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -100)
            .attr("x", -240)
            .style("text-anchor", "middle")
            .text(xAxisVariable);

        // Add x-axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickValues(d3.range(startVal, d3.max(datasend) + extend, tickval)));

        // Add y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale));
    }
    // Use D3.js to create a horizontal bar graph
    

}

