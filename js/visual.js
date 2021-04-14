var width = d3.select("#dataviz").node().getBoundingClientRect().width;
var height = 0.6 * width;

let projection = d3.geoMercator()
.translate([width / 2, height / 2]) 
.scale(1800) 
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
        .style("fill", "#0C0404")

}




var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");

var startDate = new Date("2004-11-01"),
    endDate = new Date("2017-04-01");

var margin = {top:0, right:50, bottom:0, left:50},
    width = 960 -margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#slider")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height);
    
var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoYear(d); });

var label = slider.append("text")  
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

function hue(h) {
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDate(h));
  svg.style("background-color", d3.hsl(h/1000000000, 0.8, 0.8));
}