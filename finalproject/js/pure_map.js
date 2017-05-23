(function() {
	// Our D3 code will go here.
	var inputYear = null;
	var inputDiversity = null;
	// Width and Height of the whole visualization
	var width = 600;
	var height = 700;
	// Create SVG
	var svg = d3.select("#pureMap")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	// Append empty placeholder g element to the SVG
	// g will contain geometry elements
	var g = svg.append("g");

	var projection = d3.geoAlbers()
		.scale(120000)
		.rotate([75.143621, 0])
		.center([0, 39.997818])
		.translate([width / 2, height / 2]);
	var geoPath = d3.geoPath()
		.projection(projection);

	g.selectAll("path")
		.data(mapdata_json.features)
		.enter()
		.append("path")
		.attr("fill", initialDate)
		.attr("stroke", '#000000')
		.attr("d", geoPath).attr("id", function(d) {
			return "geoid_" + d.properties.GEOID;
		})
		.on("mouseover", function() {
			console.log(d3.select(this).attr("id"));
		})
		.on("mouseout", function() {
			d3.selectAll(".selected").classed("selected", false);
		});

	//Default Map - 2012
	setDefault();

	function setDefault() {
		g.selectAll("path")
			.attr('fill', '#fff');
	}

	function initialDate(d) {
		var e = d.properties.elect2000; //how to set the initial data empty?
		if (e == "R") {
			this.parentElement.appendChild(this);
			return "#bf0000";
		} else {
			return "#005b96";
		}
	}
})();