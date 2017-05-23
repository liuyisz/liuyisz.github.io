(function() {
	// Our D3 code will go here.
	var inputYear = null;
	var inputDiversity = null;
	// Width and Height of the whole visualization
	var width = 600;
	var height = 700;
	// Create SVG
	var svg = d3.select("#raceMap")
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

	var color1 = d3.scaleThreshold() // whitepercentage
		.domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
		.range(["#909090", "#9C9C9C", "#A7A7A7", "#B2B2B2", "#BDBDBD", "#C8C8C8", "#D3D3D3", "#DEDEDE", "#E9E9E9", "#F4F4F4"]);

	g.selectAll("path")
		.data(mapdata_json.features)
		.enter()
		.append("path")
		.attr("fill", initialDate)
		.attr("stroke", '#000000')
		.attr("d", geoPath).attr("id",function(d) {
			return "geoid_" + d.properties.GEOID;
		})
		.on("mouseover", function(d) {
			console.log(d);
			d3.selectAll("#barid_" + d.properties.GEOID).classed("selected",true);
			d3.select(this).classed("selected",true);
		})
		.on("mouseout",function(){
			d3.selectAll(".selected").classed("selected",false);
		});

	//Default Map - 2012
	var defaultYear = $('#mapChangeYear').attr('data-year');
	updateYear(+defaultYear);

	// Change map depends on year
	$('#mapChangeYear').change('data-year', function() {
		var yearChanged = $('#mapChangeYear').attr('data-year');
		updateYear(+yearChanged);
		if (yearChanged === "2012") {
			if($("#map-section8-ud").attr('data-checked') === 'true' && $("#map-section8-points").attr('data-checked') === 'true') {
				svg.selectAll("circle").remove();
				updateCircle(section8dots2012_json.features);
				updatePoints(section8dots2012_json.features);
			} else if ($("#map-section8-ud").attr('data-checked') === 'true' && $("#map-section8-points").attr('data-checked') === 'false') {
				svg.selectAll("circle").remove();
				updateCircle(section8dots2012_json.features);
			} else if ($("#map-section8-ud").attr('data-checked') === 'false' && $("#map-section8-points").attr('data-checked') === 'true') {
				svg.selectAll("circle").remove();
				updatePoints(section8dots2012_json.features);
			}
		} else if (yearChanged === "2016") {
			if($("#map-section8-ud").attr('data-checked') === 'true' && $("#map-section8-points").attr('data-checked') === 'true') {
				svg.selectAll("circle").remove();
				updateCircle(section8dots2016_json.features);
				updatePoints(section8dots2016_json.features);
			} else if ($("#map-section8-ud").attr('data-checked') === 'true' && $("#map-section8-points").attr('data-checked') === 'false') {
				svg.selectAll("circle").remove();
				updateCircle(section8dots2016_json.features);
			} else if ($("#map-section8-ud").attr('data-checked') === 'false' && $("#map-section8-points").attr('data-checked') === 'true') {
				svg.selectAll("circle").remove();
				updatePoints(section8dots2016_json.features);
			}
		}
	});

	$("#map-section8-ud").change('data-checked', function() {
		if ($("#map-section8-ud").attr('data-checked') === 'true') {
			if ($('#mapChangeYear').attr('data-year') === '2012') {
				updateCircle(section8dots2012_json.features);
			} else {
				updateCircle(section8dots2016_json.features);
			}
		} else {
			svg.selectAll("circle").remove();
		}
	});

	$("#map-section8-points").change('data-checked', function() {
		if ($("#map-section8-points").attr('data-checked') === 'true') {
			if ($('#mapChangeYear').attr('data-year') === '2012') {
				updatePoints(section8dots2012_json.features);
			} else {
				updatePoints(section8dots2016_json.features);
			}
		} else {
			svg.selectAll("circle").remove();
		}
	});

	// update the values
	function updateYear(value) {
		inputYear = value;
		g.selectAll("path").attr("fill", dateMatch);
	}

	// draw the circle
	function updateCircle(features) {
		var units = svg.append("g");
		units.selectAll("circle")
			.data(features)
			.enter()
			.append("circle")
			.attr("fill", "black")
			.attr("stroke", "#999")
			.attr("class", "bubble")
			.attr("cx", function(d) {
				return projection(d.geometry.coordinates)[0];
			})
			.attr("cy", function(d) {
				return projection(d.geometry.coordinates)[1];
			})
			.attr("r", function(d) {
				return d.properties.total_unit / 10;
			});
	}

	// draw the point
	function updatePoints(features) {
		var units = svg.append("g");
		units.selectAll("circle")
			.data(features)
			.enter()
			.append("circle")
			.attr("fill", "black")
			.attr("cx", function(d) {
				return projection(d.geometry.coordinates)[0];
			})
			.attr("cy", function(d) {
				return projection(d.geometry.coordinates)[1];
			})
			.attr("r", '4px');
			
	}

	function dateMatch(data, value) {
		var r = 'GEO2' + inputYear;
		var e1 = "data.properties['" + r + "']";
		var e2 = eval(e1);
		return color1(e2); // style things here
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