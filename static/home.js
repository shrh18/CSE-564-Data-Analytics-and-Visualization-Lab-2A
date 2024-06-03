function toggleAxisDivs() {
    var graphTypeSelect = document.getElementById('graph-type');

    var xAxisDiv = document.getElementById('x-axis-div');
    var yAxisDiv = document.getElementById('y-axis-div');
    var age = document.getElementById(`avgAge`);
    var playerCount = document.getElementById('playerCount');

    var radiov = document.getElementById(`radio-vertical`);
    var radioh = document.getElementById(`radio-horizontal`);

    var radioVar1 = document.getElementById('radio-var1');
    var radioVar2 = document.getElementById('radio-var2');

    var league = document.getElementById('select-league-div')
    var Variable = document.getElementById('select-variable-div')

    var num_components = document.getElementById('num_components-div')
    var plotgraphdiv = document.getElementById('plot-graph-btn')
    var screeplotdiv = document.getElementById('screeplot-pca-btn')


    // Check if the selected option is Scatterplot (value = "2")
    if (graphTypeSelect.value === 'SCATTERPLOT') {
      xAxisDiv.style.display = 'flex';
      yAxisDiv.style.display = 'flex';
      Variable.style.display = 'none';
      radiov.style.display = 'none';
      radioh.style.display = 'none';
      radioVar1.style.display = 'flex';
      radioVar2.style.display = 'flex';
      num_components.style.display = 'none';
      screeplotdiv.style.display = 'none';
      plotgraphdiv.style.display = 'flex';
    }
    else if(graphTypeSelect.value == "SCREEPLOT"){
      xAxisDiv.style.display = 'none';
      yAxisDiv.style.display = 'none';
      league.style.display = 'none';
      Variable.style.display = 'none';
      radiov.style.display = 'none';
      radioh.style.display = 'none';
      radioVar1.style.display = 'none';
      radioVar2.style.display = 'none';
      num_components.style.display = 'none';
      screeplotdiv.style.display = 'flex';
      plotgraphdiv.style.display = 'none';
    }
    else {
      xAxisDiv.style.display = 'none';
      yAxisDiv.style.display = 'none';
      league.style.display = 'flex';
      Variable.style.display = 'flex';
      radiov.style.display = 'flex';
      radioh.style.display = 'flex';
      radioVar1.style.display = 'none';
      radioVar2.style.display = 'none';
      num_components.style.display = 'none'
      screeplotdiv.style.display='none';
      plotgraphdiv.style.display = 'flex';
    }

    if(graphTypeSelect.value === 'BAR GRAPH'){
      age.style.display = 'flex';
      playerCount.style.display = 'none';
    }
    if(graphTypeSelect.value === 'HISTOGRAM'){
      age.style.display = 'none';
      playerCount.style.display = 'flex';
    }

    document.addEventListener('DOMContentLoaded', function () {
      const xAxisSelect = document.getElementById('x-axis-variable');
      const yAxisSelect = document.getElementById('y-axis-variable');
  
      xAxisSelect.addEventListener('change', function () {
        // Get the selected option in the X-axis variable
        const selectedXAxisOption = xAxisSelect.value;
  
        // Hide the selected option in the Y-axis variable
        for (let i = 0; i < yAxisSelect.options.length; i++) {
          const option = yAxisSelect.options[i];
          if (option.value === selectedXAxisOption) {
            option.style.display = 'none';
          } else {
            option.style.display = '';
          }
        }
      });
    });

  }

  // Run the toggleAxisDivs function on page load
toggleAxisDivs();


function sendData(){
  // options selected
  var graphType = document.getElementById("graph-type").value;
  var selectedLeague = document.getElementById("select-league").value;
  var selectedVariable = document.getElementById("select-variable").value;

  var xAxisVariable = document.getElementById("x-axis-variable").value;
  var yAxisVariable = document.getElementById("y-axis-variable").value;

  var verticalBarsRadioButton = document.getElementById('flexRadioDefault2');
  if(verticalBarsRadioButton.checked){
    verticalBarsRadioButton = true
  }
  else{
    verticalBarsRadioButton = false
  }
  var horizontalBarsRadioButton = document.getElementById('flexRadioDefault1');
  if(horizontalBarsRadioButton.checked){
    horizontalBarsRadioButton = true
  }
  else{
    horizontalBarsRadioButton = false
  }

  var var1xAxisRadio = document.getElementById('flexRadioDefaultVar1');
  if(var1xAxisRadio.checked) {
    var1xAxisRadio = true;
  }
  else {
    var1xAxis = false;
  }
  var var2xAxisRadio = document.getElementById('flexRadioDefaultVar2');
  if (var2xAxisRadio.checked){
    var2xAxisRadio = true
  }
  else{
    var2xAxisRadio = false
  }

  if(var1xAxisRadio.checked){
    xAxisVariable = document.getElementById("x-axis-variable").value;
    yAxisVariable = document.getElementById("y-axis-variable").value;
  }
  else if(var2xAxisRadio.checked){
    yAxisVariable = document.getElementById("x-axis-variable").value;
    xAxisVariable = document.getElementById("y-axis-variable").value;
  }
  

  $.ajax({
    url: '/plotGraph',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({'graphType': graphType, 
                          'selectedLeague': selectedLeague,
                          'selectedVariable': selectedVariable,
                          'xAxisVariable': xAxisVariable,
                          'yAxisVariable': yAxisVariable,
                          'verticalBarsRadioButton': verticalBarsRadioButton,
                          'horizontalBarsRadioButton': horizontalBarsRadioButton,
                          'var1xAxisRadio': var1xAxisRadio,
                          'var2xAxisRadio': var2xAxisRadio }),
    dataType: 'json',                          
    success: function(response){
      console.log("In Success Part")
      console.log(response)
      if(graphType == 'BAR GRAPH'){
        console.log("In sel 1")
        if(verticalBarsRadioButton == true){
          console.log("In sel 2")
          console.log(response.data)

          verticalBarGraph(response[1], response[2], response[3], response[4], response[5], response[6], response[7], response[8], response[9], response[10], response[11]);
        }
        else if(horizontalBarsRadioButton == true){
          horizontalBarGraph(response[1], response[2], response[3], response[4], response[5], response[6], response[7], response[8], response[9], response[10], response[11]);
        }
      }
      else if(graphType == "HISTOGRAM"){
        if(verticalBarsRadioButton == true){
          verticalHistogram(response[1], response[2], response[3], response[4], response[5], response[6], response[7], response[8], response[9], response[10], response[11], response[12], response[13], response[14], response[15], response[16])
        }
        else if(horizontalBarsRadioButton == true){
          horizontalHistogram(response[1], response[2], response[3], response[4], response[5], response[6], response[7], response[8], response[9], response[10], response[11], response[12], response[13], response[14], response[15], response[16])
        }
      }
      else if(graphType == "SCATTERPLOT"){
        console.log("Scatter plot");
        if(var1xAxisRadio == true){
          console.log("sel 1")
          createScatterplot(response[1], response[2], response[3], response[4], response[5], response[6], response[7], response[8], response[9], response[10], response[11], response[12], response[13], response[14], response[15], response[16], response[17], response[18])
        }
        else if(var2xAxisRadio == true){
          createScatterplot(response[1], response[2], response[4], response[3], response[5], response[6], response[7], response[8], response[9], response[10], response[11], response[12], response[13], response[14], response[15], response[16], response[17], response[18])
        }
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('AJAX Error:', textStatus, errorThrown);
      console.log(jqXHR.responseText); // Log the detailed error response
    }
  });

}

function screeplot(){
  var num_components = document.getElementById("num_components").value;
  var selectedLeague = document.getElementById("select-league").value;

  $('#loader').show();
  $.ajax({
    url: '/pca',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
                          'num_components': 10
                          }),
    dataType: 'json',                          
    success: function(response){
      console.log("In Success Part of ScreePlot")
      console.log(response)
      updateScreePlot(response["eigenvalues"], response["explained_variance_ratio"], response['knee']);
      plotScree(response["eigenvalues"])
      plotkMeansMSE(response["kMeansMSE"])
      
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




document.getElementById("plot-graph-btn").addEventListener("click", function () {
  sendData();
});

document.getElementById("screeplot-pca-btn").addEventListener("click", function () {
  screeplot();
});




