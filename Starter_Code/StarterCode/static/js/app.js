//the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//check the data
d3.json(url).then(function(data) {
  console.log(data);
});

//initialize the page
function init() {

    //select the dropdown menu
    let dropdown = d3.select("#selDataset");

    //get data
    d3.json(url).then((data) => {
        
        //get names
        let names = data.names;

        //add the samples to dropdown selector
        names.forEach((id) => {
            dropdown.append("option").text(id).property("value", id);
        });

        // begin with default sample
        let default_sample = names[0];

        //build default plots
        buildMetadata(default_sample);
        buildBarChart(default_sample);
        buildBubbleChart(default_sample);
        buildGaugeChart(default_sample);

    });
};

//makes demographic plot
function buildMetadata(sample) {

    //get data
    d3.json(url).then((data) => {

        // variable for metadata
        let metadata = data.metadata;

        // filter samples
        let value = metadata.filter(result => result.id == sample);

        let valueData = value[0];

        //reset plot
        d3.select("#sample-metadata").html("");

        // add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

//make bar chart
function buildBarChart(sample) {

    //get data
    d3.json(url).then((data) => {

        // data 
        let sampleInfo = data.samples;

        // filter samples
        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        // store variables
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;


        // put in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // add title with layout
        let layout = {
            title: "Top 10 OTUs"
        };

        // plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// make bubble chart
function buildBubbleChart(sample) {

    //  get data
    d3.json(url).then((data) => {
        
        // data
        let sampleInfo = data.samples;

        // filter samples
        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        // store variables
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        
        // trace for the bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // add title with layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// call function when change option
function optionChanged(value) { 
    
    console.log(value); 

    // Call functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Call the initialize function
init();

