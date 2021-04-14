var width = d3.select("#dataviz").node().getBoundingClientRect().width;
var height = 0.45 * width;

let projection = d3.geoMercator()
.translate([width / 2, height / 2]) 
.scale(1500) 
.rotate([-133, 50]) //add a third index of 10
.center([0, 24]);


var svg = d3.select("#dataviz")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("class", "map")
    .attr("width", 1000)
    .attr("height", height)

const countryWrapper = svg.append("g")
    .attr("class", "country_wrapper");

let path = d3.geoPath()
    .projection(projection);

let g = svg.append("g");


async function getData() {
    d3.csv("../assets/data/Australia.csv").then((data) => {
        let newData = {}
        let extent = d3.extent(data, function(d){
            return d["acq_date"]
        });
        
        const formatTime = d3.timeFormat("%Y-%m-%d");   
        const parseTime = d3.timeParse("%Y-%m-%d");


        let timeRange = d3.timeDay.range(parseTime(extent[0]), d3.timeDay.offset(parseTime(extent[1]), 1));

        for (let i = 0; i <= timeRange.length; i++) {
            var timeKey = formatTime(timeRange[i])

            newData[timeKey] = []
        }

        console.log(newData)

        for (let i = 0; i < data.length; i++) {
            var timeKey = data[i]["acq_date"]

            newData[timeKey].push(data[i])
        }

        
        displayVisual(newData["2019-01-01"]) 

        var dataset;
    
    var formatDateIntoYear = d3.timeFormat("%Y");
    var formatDate = d3.timeFormat("%b %Y");
    var parseDate = d3.timeParse("%m/%d/%y");
    
    var startDate = parseTime(extent[0])
        endDate = parseTime(extent[1]);
    
    
    var margin = { top: 0, right: 50, bottom: 0, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;
    
    var moving = false;
    var currentValue = 0;
    var targetValue = width;
    
    ////////// slider //////////
    
    var svgSlider = d3
        .select("#slider")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height);
    
    var x = d3
        .scaleTime()
        .domain([startDate, endDate])
        .range([0, width])
        .clamp(true);
    
    var slider = svgSlider
        .append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");
    
    slider
        .append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-inset")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .call(
            d3
                .drag()
                .on("start.interrupt", function () {
                    slider.interrupt();
                })
                .on("start drag", function (event, d) {
                    currentValue = event.x;

                    update(x.invert(event.x));
                })
                .on("end", function(event, d){
                    console.log("end")
                    console.log(x.invert(event.x))
                    displayVisual(newData[formatTime(x.invert(event.x))])
                })
        );
    
    slider
        .insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function (d) {
            return formatDateIntoYear(d);
        });
    
    var handle = slider
        .insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);
    
    var label = slider
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + -25 + ")");
    
    //// Play button
    
    var playButton = d3.select("#play-button");
    
    playButton.on("click", function () {
        var button = d3.select(this);
        if (button.text() == "Pause") {
            moving = false;
            clearInterval(timer);
            // timer = 10;
            button.text("Play");
        } else {
            moving = true;
            timer = setInterval(step, 100);
            button.text("Pause");
        }
        console.log("Slider moving: " + moving);
    });
    
    function step() {
        update(x.invert(currentValue));
        displayVisual(x.invert(currentValue))
        currentValue = currentValue + targetValue / 151;
        if (currentValue > targetValue) {
            moving = false;
            currentValue = 0;
            clearInterval(timer);
            // timer = 0;
            playButton.text("Play");
            console.log("Slider moving: " + moving);
        } 
    }
    
    ////////// plot //////////
    
    var svgPlot = d3
        .select("#vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height);
    
    var plot = svgPlot
        .append("g")
        .attr("class", "plot")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    d3.csv("circles.csv", prepare).then(processData);
    
    function processData(data) {
        dataset = data;
    
        drawPlot(dataset);
    };
    
    function prepare(d) {
        d.id = d.id;
        d.date = parseDate(d.date);
        return d;
    }
    
    function drawPlot(data) {
        var locations = plot.selectAll(".location").data(data);
    
        // if filtered dataset has more circles than already existing, transition new ones in
        locations
            .enter()
            .append("circle")
            .attr("class", "location")
            .attr("cx", function (d) {
                return x(d.date);
            })
            .attr("cy", height / 2)
            .style("fill", function (d) {
                return d3.hsl(d.date / 1000000000, 0.8, 0.8);
            })
            .style("stroke", function (d) {
                return d3.hsl(d.date / 1000000000, 0.7, 0.7);
            })
            .style("opacity", 0.5)
            .attr("r", 8)
            .transition()
            .duration(400)
            .attr("r", 25)
            .transition()
            .attr("r", 8);
    
        // if filtered dataset has less circles than already existing, remove excess
        locations.exit().remove();
    }
    
    function update(h) {
        
        console.log(formatTime(h))
        handle.attr("cx", x(h));
        label.attr("x", x(h))
            .text(formatTime(h));

        
    
        // // filter data set and redraw plot
        // var newData = dataset.filter(function (d) {
        //     return d.date < h;
        // });
        // drawPlot(newData);
    }

    });
}




async function getMapdata() {
    let url = "../assets/data/subunits.json";
    let topology = await d3.json(url);


    countryWrapper.selectAll("path")
        .data(topojson.feature(topology, topology.objects.collection).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "citie_wrapper")
}

getData();
getMapdata();



function displayVisual(data) {

    countryWrapper.selectAll("circle").remove()

    countryWrapper.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return projection([d.longitude, d.latitude])[0]
        })
        .attr("cy", function (d) {
            return projection([d.longitude, d.latitude])[1]
        })
        .attr("r", 5)
        .style("fill", "#801100")

}















