function verticalHistogram(league, variable, totalGoals, leagues, allTeamsStats, allGoals, maxGoals, minGoals, LeagueAvgAge, LeaguePasses, LeagueFouls, LaLigaBin, PremierLeagueBin, Ligue1Bin, BundesligaBin, SerieABin){
    if(league == 'ALL LEAGUES'){
        const svgWidth = 800;
        const svgHeight = 665;
        const margin = { top: 10, right: 20, bottom: 60, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const kk = d3.select('#graph-container').remove();
        let histogramContainer = d3.select("#chart").append("div")
                                    .attr("id", "graph-container")
                                    .attr("class", "bg-light m-3");

        const svg = d3.select('#graph-container')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 80]);

        // Assuming datasend is an array of numerical values
        let AllBin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}};

        // Iterate over each bin for LaLiga
        for (let ageGrp in LaLigaBin) {
            for (let attribute in LaLigaBin[ageGrp]) {
                AllBin[ageGrp][attribute] += LaLigaBin[ageGrp][attribute];
            }
        }

        // Iterate over each bin for SerieA
        for (let ageGrp in SerieABin) {
            for (let attribute in SerieABin[ageGrp]) {
                AllBin[ageGrp][attribute] += SerieABin[ageGrp][attribute];
            }
        }

        // Iterate over each bin for Bundesliga
        for (let ageGrp in BundesligaBin) {
            for (let attribute in BundesligaBin[ageGrp]) {
                AllBin[ageGrp][attribute] += BundesligaBin[ageGrp][attribute];
            }
        }

        // Iterate over each bin for Ligue1
        for (let ageGrp in Ligue1Bin) {
            for (let attribute in Ligue1Bin[ageGrp]) {
                AllBin[ageGrp][attribute] += Ligue1Bin[ageGrp][attribute];
            }
        }

        // Iterate over each bin for PremierLeague
        for (let ageGrp in PremierLeagueBin) {
            for (let attribute in PremierLeagueBin[ageGrp]) {
                AllBin[ageGrp][attribute] += PremierLeagueBin[ageGrp][attribute];
            }
        }

        // Now AllBin contains the sum of attributes for all 5 leagues
        console.log(AllBin);

        let datasend = Object.keys(AllBin).map(key => {
            return {
                ageGroup: key,
                value: variable == "TOTAL GOALS SCORED" ? AllBin[key].goals :
                       variable == "PASSES COMPLETED" ? AllBin[key].sucPass/1000 :
                       variable == "PLAYER COUNT" ? AllBin[key].playerCount :
                       variable == "FOULS COMMITTED" ? AllBin[key].fouls/100 : 0
            };
        });

        console.log("Datasend - ", datasend);
        
        let tickval;
        let startVal;
        let extend;
        let title;
        let xAxisVariable;
        let yAxisVariable; 
        if(variable == "TOTAL GOALS SCORED"){
            tickval = 200;
            startVal = 0;
            extend = 400;
            title = "TOP 5 EUROPEAN LEAGUES - AGE GROUPS VS TOTAL GOALS SCORED IN SEASON 2021-22 ";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL GOALS SCORED";
        }
        else if(variable == "PLAYER COUNT"){
            console.log("league Avg age : ", datasend);
            tickval = 0.5;
            startVal = 0;
            extend = 200;
            title = "TOP 5 EUROPEAN LEAGUES - AGE GROUPS VS NUMBER OF PLAYERS IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "NUMBER OF PLEAYERS IN LEAGUE";
        }
        else if(variable == "PASSES COMPLETED"){
            console.log("league passes completed : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 100;
            title = "TOP 5 EUROPEAN LEAGUES - AGE GROUPS VS TOTAL PASSES COMPLETED IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL PASSES COMPLETED IN 1000's";
        }
        else if(variable == "FOULS COMMITTED"){
            console.log("league fouls : ", datasend);
            tickval = 20;
            startVal = 0;
            extend = 50;
            title = "TOP 5 EUROPEAN LEAGUES - AGE GROUPS VS TOTAL FOULS COMMITTED IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL FOULS COMMITTED IN 100's";
        }


        // xScale.domain([d3.min(datasend), d3.max(datasend)]);
        xScale.domain(datasend.map(d => d.ageGroup)); // Adjust xScale domain
        yScale.domain([0, d3.max(datasend, d => d.value)+extend]);

        // svg.selectAll('rect')
        //     .data(datasend)
        //     .enter()
        //     .append('rect')
        //     .attr('x', d => xScale(d.ageGroup))
        //     .attr('y', d => yScale(d.value))
        //     .attr('width', xScale.bandwidth()) // Adjust width based on data length
        //     .attr('height', d => height - yScale(d.value))
        //     .attr('fill', 'steelblue');

        svg.selectAll('rect')
            .data(datasend)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.ageGroup))
            .attr('y', height)  // Start the bars from the bottom of the chart
            .attr('width', xScale.bandwidth())
            .attr('height', 0)  // Start the bars with zero height
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('y', d => yScale(d.value))  // Set the final y position
            .attr('height', d => height - yScale(d.value));  // Set the final height
        

        svg.append("text")      // text label for the x axis
            .attr("x", 350 )
            .attr("y",  45 )
            .style("text-anchor", "middle")
            .text(title);

        svg.append("text")      // text label for the x-axis
            .attr("x", width / 2)
            .attr("y", height + margin.top + 20+15)
            .style("text-anchor", "middle")
            .text(xAxisVariable);

        svg.append("text")      // text label for the y-axis
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height / 2)
            .style("text-anchor", "middle")
            .text(yAxisVariable);

        // Add x-axis
        svg.append('g')
            .call(d3.axisBottom(xScale))
            .attr('transform', `translate(0,${height})`);
            

        // Add y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale));

    }
    else{
        const svgWidth = 800;
        const svgHeight = 665;
        const margin = { top: 10, right: 20, bottom: 60, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const kk = d3.select('#graph-container').remove();
        let histogramContainer = d3.select("#chart").append("div")
                                    .attr("id", "graph-container")
                                    .attr("class", "bg-light m-3");

        const svg = d3.select('#graph-container')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 80]);

        // Assuming datasend is an array of numerical values
        let bin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}};

        if(league == "Premier League"){
            bin = PremierLeagueBin;
        }
        else if(league == "La Liga"){
            bin = LaLigaBin;
        }
        else if(league == "Serie A"){
            bin = SerieABin;
        }
        else if(league == "Bundesliga"){
            bin = BundesligaBin;
        }
        else if(league == "Ligue 1"){
            bin = Ligue1Bin;
        }

        console.log(bin);

        let datasend = Object.keys(bin).map(key => {
            return {
                ageGroup: key,
                value: variable == "TOTAL GOALS SCORED" ? bin[key].goals :
                       variable == "PASSES COMPLETED" ? bin[key].sucPass/100 :
                       variable == "PLAYER COUNT" ? bin[key].playerCount :
                       variable == "FOULS COMMITTED" ? bin[key].fouls/10 : 0
            };
        });

        console.log("Datasend - ", datasend);
        
        let tickval;
        let startVal;
        let extend;
        let title;
        let xAxisVariable;
        let yAxisVariable; 
        if(variable == "TOTAL GOALS SCORED"){
            tickval = 200;
            startVal = 0;
            extend = 400;
            title = league.toUpperCase() + " - AGE GROUPS VS TOTAL GOALS SCORED IN SEASON 2021-22 ";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL GOALS SCORED";
        }
        else if(variable == "PLAYER COUNT"){
            console.log("league Avg age : ", datasend);
            tickval = 0.5;
            startVal = 0;
            extend = 50;
            title = league.toUpperCase() + " - AGE GROUPS VS NUMBER OF PLAYERS IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "NUMBER OF PLEAYERS IN LEAGUE";
        }
        else if(variable == "PASSES COMPLETED"){
            console.log("league passes completed : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 100;
            title = league.toUpperCase() + " - AGE GROUPS VS TOTAL PASSES COMPLETED IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL PASSES COMPLETED IN 1000's";
        }
        else if(variable == "FOULS COMMITTED"){
            console.log("league fouls : ", datasend);
            tickval = 20;
            startVal = 0;
            extend = 50;
            title = league.toUpperCase() + " - AGE GROUPS VS TOTAL FOULS COMMITTED IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL FOULS COMMITTED IN 100's";
        }


        // xScale.domain([d3.min(datasend), d3.max(datasend)]);
        xScale.domain(datasend.map(d => d.ageGroup)); // Adjust xScale domain
        yScale.domain([0, d3.max(datasend, d => d.value)+extend]);

        // svg.selectAll('rect')
        //     .data(datasend)
        //     .enter()
        //     .append('rect')
        //     .attr('x', d => xScale(d.ageGroup))
        //     .attr('y', d => yScale(d.value))
        //     .attr('width', xScale.bandwidth()) // Adjust width based on data length
        //     .attr('height', d => height - yScale(d.value))
        //     .attr('fill', 'steelblue');

        svg.selectAll('rect')
            .data(datasend)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.ageGroup))
            .attr('y', height)  // Start the bars from the bottom of the chart
            .attr('width', xScale.bandwidth())
            .attr('height', 0)  // Start the bars with zero height
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(1500)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('y', d => yScale(d.value))  // Set the final y position
            .attr('height', d => height - yScale(d.value));  // Set the final height
        

        svg.append("text")      // text label for the x axis
            .attr("x", 350 )
            .attr("y",  45 )
            .style("text-anchor", "middle")
            .text(title);

        svg.append("text")      // text label for the x-axis
            .attr("x", width / 2)
            .attr("y", height + margin.top + 20+15)
            .style("text-anchor", "middle")
            .text(xAxisVariable);

        svg.append("text")      // text label for the y-axis
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height / 2)
            .style("text-anchor", "middle")
            .text(yAxisVariable);

        // Add x-axis
        svg.append('g')
            .call(d3.axisBottom(xScale))
            .attr('transform', `translate(0,${height})`);
            

        // Add y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale));
    }

}

function horizontalHistogram(league, variable, totalGoals, leagues, allTeamsStats, allGoals, maxGoals, minGoals, LeagueAvgAge, LeaguePasses, LeagueFouls, LaLigaBin, PremierLeagueBin, Ligue1Bin, BundesligaBin, SerieABin){
    if(league == 'ALL LEAGUES'){
        const svgWidth = 1200;
        const svgHeight = 665;
        const margin = { top: 90, right: 20, bottom: 60, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const kk = d3.select('#graph-container').remove();
        let histogramContainer = d3.select("#chart").append("div")
                                    .attr("id", "graph-container")
                                    .attr("class", "bg-light m-3");

        const svg = d3.select('#graph-container')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleBand().range([height, 0]);

        // Assuming datasend is an array of numerical values
        let AllBin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}};

        // Iterate over each bin for LaLiga
        for (let ageGrp in LaLigaBin) {
            for (let attribute in LaLigaBin[ageGrp]) {
                AllBin[ageGrp][attribute] += LaLigaBin[ageGrp][attribute];
            }
        }

        // Iterate over each bin for SerieA
        for (let ageGrp in SerieABin) {
            for (let attribute in SerieABin[ageGrp]) {
                AllBin[ageGrp][attribute] += SerieABin[ageGrp][attribute];
            }
        }

        // Iterate over each bin for Bundesliga
        for (let ageGrp in BundesligaBin) {
            for (let attribute in BundesligaBin[ageGrp]) {
                AllBin[ageGrp][attribute] += BundesligaBin[ageGrp][attribute];
            }
        }

        // Iterate over each bin for Ligue1
        for (let ageGrp in Ligue1Bin) {
            for (let attribute in Ligue1Bin[ageGrp]) {
                AllBin[ageGrp][attribute] += Ligue1Bin[ageGrp][attribute];
            }
        }

        // Iterate over each bin for PremierLeague
        for (let ageGrp in PremierLeagueBin) {
            for (let attribute in PremierLeagueBin[ageGrp]) {
                AllBin[ageGrp][attribute] += PremierLeagueBin[ageGrp][attribute];
            }
        }

        // Now AllBin contains the sum of attributes for all 5 leagues
        console.log(AllBin);

        let datasend = Object.keys(AllBin).map(key => {
            return {
                ageGroup: key,
                value: variable == "TOTAL GOALS SCORED" ? AllBin[key].goals :
                       variable == "PASSES COMPLETED" ? AllBin[key].sucPass/1000 :
                       variable == "PLAYER COUNT" ? AllBin[key].playerCount :
                       variable == "FOULS COMMITTED" ? AllBin[key].fouls/100 : 0
            };
        });

        console.log("Datasend - ", datasend);
        
        let tickval;
        let startVal;
        let extend;
        let title;
        let xAxisVariable;
        let yAxisVariable; 
        if(variable == "TOTAL GOALS SCORED"){
            tickval = 200;
            startVal = 0;
            extend = 400;
            title = "TOP 5 EUROPEAN LEAGUES - AGE GROUPS VS TOTAL GOALS SCORED IN SEASON 2021-22 ";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL GOALS SCORED";
        }
        else if(variable == "PLAYER COUNT"){
            console.log("league Avg age : ", datasend);
            tickval = 0.5;
            startVal = 0;
            extend = 200;
            title = "TOP 5 EUROPEAN LEAGUES - AGE GROUPS VS NUMBER OF PLAYERS IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "NUMBER OF PLEAYERS IN LEAGUE";
        }
        else if(variable == "PASSES COMPLETED"){
            console.log("league passes completed : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 100;
            title = "TOP 5 EUROPEAN LEAGUES - AGE GROUPS VS TOTAL PASSES COMPLETED IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL PASSES COMPLETED IN 1000's";
        }
        else if(variable == "FOULS COMMITTED"){
            console.log("league fouls : ", datasend);
            tickval = 20;
            startVal = 0;
            extend = 50;
            title = "TOP 5 EUROPEAN LEAGUES - AGE GROUPS VS TOTAL FOULS COMMITTED IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL FOULS COMMITTED IN 100's";
        }


        // xScale.domain([d3.min(datasend), d3.max(datasend)]);
        yScale.domain(datasend.map(d => d.ageGroup)); // Adjust xScale domain
        xScale.domain([0, d3.max(datasend, d => d.value)+extend]);

        // svg.selectAll('rect')
        //     .data(datasend)
        //     .enter()
        //     .append('rect')
        //     .attr('x', 0)
        //     .attr('y', d => yScale(d.ageGroup))
        //     .attr('width', d => xScale(d.value)) // Adjust width based on data length
        //     .attr('height', yScale.bandwidth())
        //     .attr('fill', 'steelblue');

        svg.selectAll('rect')
            .data(datasend)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', d => yScale(d.ageGroup))
            .attr('width', 0)  // Start the bars with zero width
            .attr('height', yScale.bandwidth())
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(2000)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('width', d => xScale(d.value))  // Set the final width
            .attr('x', 0);  // Set the final x position


        svg.append("text")      // text label for the x axis
            .attr("x", width/2 )
            .attr("y",  15 )
            .style("text-anchor", "middle")
            .text(title);

        svg.append("text")      // text label for the x-axis
            .attr("x", width / 2)
            .attr("y", 560)
            .style("text-anchor", "middle")
            .text(yAxisVariable);

        svg.append("text")      // text label for the y-axis
            .attr("transform", "rotate(-90)")
            .attr("y", -55)
            .attr("x", -height / 2)
            .style("text-anchor", "middle")
            .text(xAxisVariable);

        // Add x-axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));            

        // Add y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale));

    }
    else{
        const svgWidth = 1200;
        const svgHeight = 665;
        const margin = { top: 90, right: 20, bottom: 60, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const kk = d3.select('#graph-container').remove();
        let histogramContainer = d3.select("#chart").append("div")
                                    .attr("id", "graph-container")
                                    .attr("class", "bg-light m-3");

        const svg = d3.select('#graph-container')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleBand().range([height, 0]);

        // Assuming datasend is an array of numerical values
        let bin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
        "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}};

        if(league == "Premier League"){
            bin = PremierLeagueBin;
        }
        else if(league == "La Liga"){
            bin = LaLigaBin;
        }
        else if(league == "Serie A"){
            bin = SerieABin;
        }
        else if(league == "Bundesliga"){
            bin = BundesligaBin;
        }
        else if(league == "Ligue 1"){
            bin = Ligue1Bin;
        }

        console.log(bin);

        let datasend = Object.keys(bin).map(key => {
            return {
                ageGroup: key,
                value: variable == "TOTAL GOALS SCORED" ? bin[key].goals :
                       variable == "PASSES COMPLETED" ? bin[key].sucPass/100 :
                       variable == "PLAYER COUNT" ? bin[key].playerCount :
                       variable == "FOULS COMMITTED" ? bin[key].fouls/10 : 0
            };
        });

        console.log("Datasend - ", datasend);
        
        let tickval;
        let startVal;
        let extend;
        let title;
        let xAxisVariable;
        let yAxisVariable; 
        if(variable == "TOTAL GOALS SCORED"){
            tickval = 100;
            startVal = 0;
            extend = 100;
            title = league.toUpperCase() + " - AGE GROUPS VS TOTAL GOALS SCORED IN SEASON 2021-22 ";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL GOALS SCORED";
        }
        else if(variable == "PLAYER COUNT"){
            console.log("league Avg age : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 100;
            title = league.toUpperCase() + " - AGE GROUPS VS NUMBER OF PLAYERS IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "NUMBER OF PLEAYERS IN LEAGUE";
        }
        else if(variable == "PASSES COMPLETED"){
            console.log("league passes completed : ", datasend);
            tickval = 50;
            startVal = 0;
            extend = 200;
            title = league.toUpperCase() + " - AGE GROUPS VS TOTAL PASSES COMPLETED IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL PASSES COMPLETED IN 1000's";
        }
        else if(variable == "FOULS COMMITTED"){
            console.log("league fouls : ", datasend);
            tickval = 20;
            startVal = 0;
            extend = 50;
            title = league.toUpperCase() + " - AGE GROUPS VS TOTAL FOULS COMMITTED IN SEASON 2021-22";
            xAxisVariable = "AGE GROUPS";
            yAxisVariable = "TOTAL FOULS COMMITTED IN 100's";
        }


        // xScale.domain([d3.min(datasend), d3.max(datasend)]);
        yScale.domain(datasend.map(d => d.ageGroup)); // Adjust xScale domain
        xScale.domain([0, d3.max(datasend, d => d.value)+extend]);

        // svg.selectAll('rect')
        //     .data(datasend)
        //     .enter()
        //     .append('rect')
        //     .attr('x', 0)
        //     .attr('y', d => yScale(d.ageGroup))
        //     .attr('width', d => xScale(d.value)) // Adjust width based on data length
        //     .attr('height', yScale.bandwidth())
        //     .attr('fill', 'steelblue');

        svg.selectAll('rect')
            .data(datasend)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', d => yScale(d.ageGroup))
            .attr('width', 0)  // Start the bars with zero width
            .attr('height', yScale.bandwidth())
            .attr('fill', 'steelblue')
            .transition()  // Apply the transition
            .duration(2000)  // Set the duration of the transition in milliseconds (2 seconds in this case)
            .attr('width', d => xScale(d.value))  // Set the final width
            .attr('x', 0);  // Set the final x position


        svg.append("text")      // text label for the x axis
            .attr("x", width/2 )
            .attr("y",  15 )
            .style("text-anchor", "middle")
            .text(title);

        svg.append("text")      // text label for the x-axis
            .attr("x", width / 2)
            .attr("y", 560)
            .style("text-anchor", "middle")
            .text(yAxisVariable);

        svg.append("text")      // text label for the y-axis
            .attr("transform", "rotate(-90)")
            .attr("y", -55)
            .attr("x", -height / 2)
            .style("text-anchor", "middle")
            .text(xAxisVariable);

        // Add x-axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));
            

        // Add y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale));
    }
}