var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

d3.tsv("geojson/2012raceincomehousing0519.tsv", function(error, test_data) {

	test_data.forEach(function(d) {
		d['GEOID102012'] = +d['GEOID102012'];
		d['SECTION82012'] = +d['SECTION82012'];
		d['WHITE2012'] = +d['WHITE2012'];
		d['INCOME2012'] = +d['INCOME2012'];
	});

	// Income 2012
	createChart(test_data, 'GEOID102012', 'income_chart_2012', 'INCOME2012', 'incomeSort');

	// White 2012
	createChart(test_data, 'GEOID102012', 'white_chart_2012', 'WHITE2012', 'raceSort');

	//Section 8 2012
	createChart(test_data, 'GEOID102012', 'section_8_2012', 'SECTION82012', 'section8Sort');

});

d3.tsv("geojson/2016raceincomehousing0519.tsv", function(error, test_data) {

	test_data.forEach(function(d) {
		d['GEOID102016'] = +d['GEOID102016'];
		d['SECTION82016'] = +d['SECTION82016'];
		d['WHITE2016'] = +d['WHITE2016'];
		d['INCOME2016'] = +d['INCOME2016'];
	});

	// Income 2016
	createChart(test_data, 'GEOID102016', 'income_chart_2016', 'INCOME2016', 'incomeSort');

	// White 2016
	createChart(test_data, 'GEOID102016', 'white_chart_2016', 'WHITE2016', 'raceSort');

	//Section 8 2016
	createChart(test_data, 'GEOID102016', 'section_8_2016', 'SECTION82016', 'section8Sort');

});

/**
 * This function is used to create the chart for each options depending on GEO ID
 * Sort function and is embedded in here.
 */
function createChart(test_data, geoId, divId, test_object, sortDivId) {

	var margin = {top: 20, right: 20, bottom: 80, left: 40},
		width = 700 - margin.left - margin.right,
		height = 200 - margin.top - margin.bottom;

	var xValue = function(_d) {
			return _d[geoId];
		},
		xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		xMap = function(_d) {
			return xScale(xValue(_d));
		},
		xAxis = d3.axisBottom(xScale);
	
	var yValue = function(_d) {
			return _d[test_object];
		},
		yScale = d3.scaleLinear().range([height, 0]),
		yMap = function(_d) {
			return yScale(yValue(_d));
		},
		yAxis = d3.axisLeft(yScale);

	d3.select("#" + divId).transition();
	
	var svg = d3.select("#" + divId).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var isChecked = false;

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	xScale.domain(test_data.map(xValue));
	yScale.domain([0, d3.max(test_data, yValue)]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis)
	.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", "-.55em")
		.attr("transform", "rotate(-90)" )
		.attr('visibility', 'hidden');

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Section 8 Income");

	svg.selectAll(".bar")
		.data(test_data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", xMap)
		.attr("width", xScale.bandwidth)
		.attr("y", yMap)
		.attr("id", function(d) {
			return "barid_"+d[geoId];
		})
		.attr("height", function(_d){
			return height - yMap(_d);
		})
		.on('mouseover', function(d) {
			console.log('mouseon');
			div.transition().duration(200).style("opacity", .9);
			div.html(test_object + ': ' + d[test_object])
				.style("color", "#FFF")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			
			highlightMapByGeoId(d[geoId]);

			$("#map-details-ct").html(d['GEOID102012']);
			$("#map-details-inc").html(d['INCOME2012'] ? d['INCOME2012'] : d['INCOME2016']);
			$("#map-details-white").html(d['WHITE2012'] ? d['WHITE2012'] : d['WHITE2016']);
			$("#map-details-section8").html(d['SECTION82012'] ? d['SECTION82012'] : d['SECTION82016']);
		})
		.on('mouseout', function(d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
			
			dishighlightMap();

			$("map-details-ct").html("");
			$("map-details-ng").html("");
			$("#map-details-inc").html("");
			$("#map-details-white").html("");
			$("#map-details-section8").html("");
		});

	/**
	 * Data-binding for the sort control panel
	 */
	$(document).on('data-attribute-changed-' + sortDivId, function() {
		var data = $('#sort-by-value').attr('data-value');
		if (data === 'incomeSort') {
			if ($('#mapChangeYear').attr('data-year') == '2012') {
				sortValues('INCOME2012');
			} else {
				sortValues('INCOME2016');
			}
		} else if(data === 'raceSort') {
			if ($('#mapChangeYear').attr('data-year') == '2012') {
				sortValues('WHITE2012');
			} else {
				sortValues('WHITE2016');
			}
		} else if(data === 'section8Sort') {
			if ($('#mapChangeYear').attr('data-year') == '2012') {
				sortValues('SECTION82012');
			} else {
				sortValues('SECTION82016');
			}
		} else if (data === 'censusTractSort') {
			// Reset function
			if ($('#mapChangeYear').attr('data-year') == '2012') {
				console.log('2012 reset');
			} else {
				console.log('2016 reset');
			}
		}
	});

	var sortValues = function(sortObject) {
		var x0 = xScale.domain(test_data.sort(this.checked
			? function(a, b) { return d3.ascending(a[geoId], b[geoId]);}
			: function(a, b) { return b[sortObject] - a[sortObject]; })
			.map(function(d) { return d[geoId]; }))
			.copy();
		
		svg.selectAll(".bar")
			.sort(function(a,b) {
				return x0(a[geoId]) - x0(b[geoId]);
			});
		
		var transition = svg.transition().duration(750),
			delay = function(d, i) {
				return i * 50;
			};
		
		transition.selectAll(".bar")
			.delay(delay)
			.attr("x", function(d) { return x0(d[geoId]); });
		
		transition.select(".x.axis")
			.call(xAxis)
		.selectAll("g")
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", "-.55em")
			.attr("transform", "rotate(-90)" );
	};

}

/************************** Map Functions Start **************************/

/**
 * This function is used to change the map between 2012 and 2016
 * This function is different from change Chart, this checkbox make map value change
 */
function mapChangeYear() {
	//Map Change
	var currentYear = document.getElementById('mapChangeYear').getAttribute('data-year');
	if (currentYear === '2012') {
		document.getElementById('mapChangeYear').setAttribute('data-year', '2016');
	} else {
		document.getElementById('mapChangeYear').setAttribute('data-year', '2012');
	}
	//Chart Change
	if($('.chart-2016').css('display') === 'none' && $('.chart-2012').css('display') === 'block') {
		$('.chart-2016').css('display', 'block');
		$('.chart-2012').css('display', 'none');
		$('#changeYear').attr('data-year', '2016');
	} else {
		$('.chart-2016').css('display', 'none');
		$('.chart-2012').css('display', 'block');
		$('#changeYear').attr('data-year', '2012');
	}	
}

function changeMap() {
	var mapDetect = document.getElementById('map-sort-by-value').getAttribute('data-value');
	if(mapDetect === 'incomeMap') {
		$('#incomeMap').css('display', 'block');
		$('#electionMap, #raceMap, #pureMap').css('display', 'none');
	} else if(mapDetect === 'electionMap') {
		$('#electionMap').css('display', 'block');
		$('#raceMap, #incomeMap, #pureMap').css('display', 'none');
	} else if(mapDetect === 'raceMap') {
		$('#raceMap').css('display', 'block');
		$('#electionmap, #incomeMap, #pureMap').css('display', 'none');
	} else if(mapDetect === 'censusTractMap') {
		$('#pureMap').css('display', 'block');
		$('#electionmap, #incomeMap, #raceMap').css('display', 'none');
	}
}

function showPoints() {
	var isChecked = $("#map-section8-points").attr('data-checked');
	if (isChecked === 'false') {
		$("#map-section8-points").attr('data-checked', 'true');
	} else {
		$("#map-section8-points").attr('data-checked', 'false');
	}
}

function showCircle() {
	var isChecked = $("#map-section8-ud").attr('data-checked');
	if (isChecked === 'false') {
		$("#map-section8-ud").attr('data-checked', 'true');
	} else {
		$("#map-section8-ud").attr('data-checked', 'false');
	}
}

function highlightMapByGeoId(geoId) {
	console.log(geoId);
	d3.selectAll('#barid_' + geoId).classed("selected", true);
}

function dishighlightMap() {
	d3.selectAll(".selected").classed("selected", false);
}

/**
 * This part is used to create a map sort control panel
 * It's using third party library noUISlider
 */
(function() {
	var mapStepSlider = document.getElementById('map_sort_control');

	noUiSlider.create(mapStepSlider, {
		start: 5,
		step: 30,
		range: {
			'min': [0],
			'max': [100]
		}
	});

	var mapRangeSlider = document.getElementById('map-sort-by-value');

	mapStepSlider.noUiSlider.on('update', function( values, handle ) {
		if(values[handle] && values[handle] == 0) {
			mapRangeSlider.setAttribute('data-value', 'censusTractMap');
			changeMap();
		} else if (values[handle] && values[handle] == 30) {
			mapRangeSlider.setAttribute('data-value', 'incomeMap');
			changeMap();
		} else if (values[handle] && values[handle] == 60) {
			mapRangeSlider.setAttribute('data-value', 'raceMap');
			changeMap();
		} else if (values[handle] && values[handle] == 90) {
			mapRangeSlider.setAttribute('data-value', 'electionMap');
			changeMap();
		}
	});
})();

/************************** Chart Functions Start **************************/

/**
 * Sort functions
 */
function sortFunctions() {
	$(document).trigger('data-attribute-changed-incomeSort');
	$(document).trigger('data-attribute-changed-raceSort');
	$(document).trigger('data-attribute-changed-section8Sort');
}

/**
 * This part is used to create a sort control panel
 * It's using third parth library noUISlider
 */
(function() {
	var stepSlider = document.getElementById('sort_control');

	noUiSlider.create(stepSlider, {
		start: 5,
		step: 30,
		range: {
			'min': [0],
			'max': [100]
		}
	});

	var rangeSlider = document.getElementById('sort-by-value');

	stepSlider.noUiSlider.on('update', function( values, handle ) {
		if(values[handle] && values[handle] == 0) {
			rangeSlider.setAttribute('data-value', 'censusTractSort');
			this.isChecked = true;
			sortFunctions();
		} else if (values[handle] && values[handle] == 30) {
			rangeSlider.setAttribute('data-value', 'incomeSort');
			this.isChecked = false;
			sortFunctions();
		} else if (values[handle] && values[handle] == 60) {
			rangeSlider.setAttribute('data-value', 'raceSort');
			this.isChecked = false;
			sortFunctions();
		} else if (values[handle] && values[handle] == 90) {
			rangeSlider.setAttribute('data-value', 'section8Sort');
			this.isChecked = false;
			sortFunctions();
		}
	});
})();
