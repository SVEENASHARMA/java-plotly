var dropDown = d3.select('#selDataset');
dropDown.on('change', optionChanged);

function init() {
  d3.json("/samples").then((data) => {
    data.names.forEach(name => {
      d3.select('#selDataset').append('option').attr('value', name).text(name);
    })
    buildChart(data);
    buildGauge(data);
    buildMetadata(data);
  });
};

function optionChanged(){
  init();
};

function buildChart(data){

  var subjectID = d3.select('#selDataset').node().value;
  let datasample= data.samples.find(sample => sample.id == subjectID);

  var top10Ids = datasample .otu_ids.slice(0, 10).map(item => 'otu' + item);
  var top10 = datasample.sample_values.slice(0, 10);
  //console.log(top10);

//Bar Chart

  var trace1 = {
    type: 'bar',
    x: top10,
    y: top10Ids,
    orientation: 'h',
  };
  var layout = {
    title: 'Top 10 OTUs per Each Individual',
    barmode: 'stack',
    width: '100%'
  };
  var bardata = [trace1];
  
  Plotly.newPlot('bar', bardata, layout);

  //Bubble Chart
  var trace1 = {
    x: datasample.otu_ids,
    y: datasample.sample_values,
    text: datasample.otu_labels,
    mode: 'markers',
    marker: {
      color: datasample.otu_ids,
      size: datasample.sample_values
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'OTU Sample',
    xaxis: {title: 'OTU ID'},
    showlegend: false,
    height: 600,
    width: 1200
  };
  
  Plotly.newPlot('bubble', data, layout);
};

//Build Metadata

function buildMetadata(data){
    //find sample by id
    var subjectID = d3.select('#selDataset').node().value;
    let datasample = data.metadata.find(subject => subject.id == subjectID);
    var sampleMetadata = d3.select('#sample-metadata');
    sampleMetadata.html('');
    var table = sampleMetadata.append('table');
    table.attr('class', 'table table-striped')
    Object.entries(datasample).forEach(([key, value]) => {
      var row = table.append('tr');
      var cell = row.append('td');
      cell.text(`${key}:`);
      var cell = row.append('td');
      cell.text(value);
    })

}

//Gauge Chart

function buildGauge(data){
  var subjectID = d3.select('#selDataset').node().value;
  let datasample = data.metadata.find(subject => subject.id == subjectID);
  var gauge = d3.select('#gauge');
  var frequency = datasample.wfreq;
  console.log(frequency);

  var trace1 =
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: frequency,
      title: { text: "Belly Button Washing Fequency" },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 5, increasing: { color: "RebeccaPurple" }},
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 5], color: "cyan" },
          { range: [5, 10], color: "royalblue" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 10
        }
      }
    };
    var data = [trace1];
  
  var layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);
}


init();